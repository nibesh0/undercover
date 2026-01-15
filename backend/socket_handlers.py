"""Socket.IO event handlers for Undercover game."""

from flask_socketio import emit, join_room, leave_room
from game_manager import GameManager
from utils import generate_room_code, sanitize_string, validate_room_code, validate_player_name

# Global game manager instance
game_manager = GameManager()


def register_socket_handlers(socketio):
    """Register all Socket.IO event handlers."""
    
    @socketio.on('connect')
    def handle_connect(auth=None):
        """Handle client connection."""
        from flask import request
        print(f"Client connected: {request.sid}")
        emit('connected', {'message': 'Connected to server'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection."""
        from flask import request
        player_id = request.sid
        print(f"Client disconnected: {player_id}")
        
        # Find and update the room
        room = game_manager.get_room_by_player(player_id)
        if room:
            room.remove_player(player_id)
            
            # Notify other players
            emit('player_left', {
                'player_id': player_id,
                'game_state': room.get_public_state()
            }, room=room.room_code)
            
            # Delete room if empty (with grace period for reconnects)
            if not room.players:
                def delayed_cleanup(code):
                    try:
                        socketio.sleep(5)
                        r = game_manager.get_room(code)
                        if r and not r.players:
                            game_manager.delete_room(code)
                            print(f"Room {code} deleted after grace period")
                    except Exception as e:
                        print(f"Error in cleanup task: {e}")

                socketio.start_background_task(delayed_cleanup, room.room_code)
    
    @socketio.on('create_room')
    def handle_create_room(data):
        """Create a new game room."""
        from flask import request
        player_name = sanitize_string(data.get('player_name', 'Player'), 20)
        
        if not validate_player_name(player_name):
            emit('error', {'message': 'Invalid player name'})
            return
        
        # Generate unique room code
        room_code = generate_room_code()
        while game_manager.get_room(room_code):
            room_code = generate_room_code()
        
        # Create room
        room = game_manager.create_room(room_code, request.sid, player_name)
        
        # Join socket room
        join_room(room_code)
        
        # Send response
        emit('room_created', {
            'room_code': room_code,
            'game_state': room.get_public_state(),
            'player_data': room.get_player_private_state(request.sid)
        })
    
    @socketio.on('join_room')
    def handle_join_room(data):
        """Join an existing game room."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        player_name = sanitize_string(data.get('player_name', 'Player'), 20)
        
        if not validate_room_code(room_code):
            emit('error', {'message': 'Invalid room code'})
            return
        
        if not validate_player_name(player_name):
            emit('error', {'message': 'Invalid player name'})
            return
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        if room.phase != 'lobby':
            emit('error', {'message': 'Game already in progress'})
            return
        
        # Check if name already exists in room (case-insensitive)
        # Exclude current socket ID in case they're reconnecting
        existing_names = [p['name'].lower() for p_id, p in room.players.items() if p_id != request.sid]
        if player_name.lower() in existing_names:
            emit('error', {'message': 'A player with this name already exists in the room'})
            return
        
        # Add player to room
        try:
            room.add_player(request.sid, player_name)
        except ValueError as e:
            emit('error', {'message': str(e)})
            return
        
        # Join socket room
        join_room(room_code)
        
        # Notify all players
        emit('player_joined', {
            'game_state': room.get_public_state()
        }, room=room_code)
        
        # Send private data to joining player
        emit('room_joined', {
            'room_code': room_code,
            'game_state': room.get_public_state(),
            'player_data': room.get_player_private_state(request.sid)
        })
    
    @socketio.on('leave_room')
    def handle_leave_room(data):
        """Leave current room."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        
        room = game_manager.get_room(room_code)
        if not room:
            return
        
        room.remove_player(request.sid)
        leave_room(room_code)
        
        # Notify other players
        emit('player_left', {
            'player_id': request.sid,
            'game_state': room.get_public_state()
        }, room=room_code)
        
        # Delete room if empty
        if not room.players:
            game_manager.delete_room(room_code)
    
    @socketio.on('update_settings')
    def handle_update_settings(data):
        """Update game settings (host only)."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        # Verify host
        if request.sid != room.host_id:
            emit('error', {'message': 'Only host can update settings'})
            return
        
        # Update undercover count if provided
        if 'undercover_count' in data:
            undercover_count = int(data['undercover_count'])
            max_undercovers = len(room.players) - 2
            if 1 <= undercover_count <= max_undercovers:
                room.undercover_count = undercover_count
                
                # Notify all players of updated settings
                emit('settings_updated', {
                    'game_state': room.get_public_state()
                }, room=room_code)
    
    @socketio.on('start_game')
    def handle_start_game(data):
        """Start the game (host only)."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        # Verify host
        if request.sid != room.host_id:
            emit('error', {'message': 'Only host can start game'})
            return
        
        try:
            room.start_game()
            
            # Send public state to all
            emit('game_started', {
                'game_state': room.get_public_state()
            }, room=room_code)
            
            # Send private role/word to each player
            for player_id in room.players:
                emit('role_assigned', {
                    'player_data': room.get_player_private_state(player_id)
                }, room=player_id)
            
        except ValueError as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('submit_clue')
    def handle_submit_clue(data):
        """Submit a word clue."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        clue = sanitize_string(data.get('clue', ''), 50)
        
        if not clue:
            emit('error', {'message': 'Clue cannot be empty'})
            return
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        try:
            room.submit_clue(request.sid, clue)
            
            # Notify all players
            emit('clue_submitted', {
                'game_state': room.get_public_state()
            }, room=room_code)
            
        except ValueError as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('submit_vote')
    def handle_submit_vote(data):
        """Submit a vote for elimination."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        voted_for_id = data.get('voted_for_id')
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        if voted_for_id not in room.players:
            emit('error', {'message': 'Invalid vote target'})
            return
        
        try:
            room.submit_vote(request.sid, voted_for_id)
            
            # Check if game ended (transitioned to results)
            if room.phase == 'results':
                # Reveal all roles and send results
                emit('game_ended', {
                    'game_state': room.get_public_state(),
                    'all_players': [
                        {
                            'id': p['id'],
                            'name': p['name'],
                            'role': p['role'],
                            'word': p['word'],
                            'is_alive': p['is_alive']
                        }
                        for p in room.players.values()
                    ],
                    'civilian_word': room.civilian_word,
                    'undercover_word': room.undercover_word
                }, room=room_code)
            else:
                # Notify all players of vote result
                emit('vote_submitted', {
                    'game_state': room.get_public_state(),
                    'eliminated_player_id': room.eliminated_player_id
                }, room=room_code)
            
        except ValueError as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('mr_white_guess')
    def handle_mr_white_guess(data):
        """Handle Mr. White's final guess."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        guess = sanitize_string(data.get('guess', ''), 50)
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        # Verify it's Mr. White
        player = room.players.get(request.sid)
        if not player or player['role'] != 'mrwhite':
            emit('error', {'message': 'Only Mr. White can guess'})
            return
        
        room.process_mr_white_guess(guess)
        
        # Reveal all roles and send results
        emit('game_ended', {
            'game_state': room.get_public_state(),
            'all_players': [
                {
                    'id': p['id'],
                    'name': p['name'],
                    'role': p['role'],
                    'word': p['word']
                }
                for p in room.players.values()
            ],
            'civilian_word': room.civilian_word,
            'undercover_word': room.undercover_word,
            'mr_white_guess': guess
        }, room=room_code)
    
    @socketio.on('play_again')
    def handle_play_again(data):
        """Reset game to lobby."""
        from flask import request
        room_code = data.get('room_code', '').upper()
        
        room = game_manager.get_room(room_code)
        if not room:
            emit('error', {'message': 'Room not found'})
            return
        
        # Reset room to lobby state
        room.phase = 'lobby'
        room.round_number = 1
        room.current_turn_index = 0
        room.clues = []
        room.votes = {}
        room.civilian_word = None
        room.undercover_word = None
        room.eliminated_player_id = None
        room.winner = None
        
        # Reset all players
        for player in room.players.values():
            player['role'] = None
            player['word'] = None
            player['is_alive'] = True
        
        emit('game_reset', {
            'game_state': room.get_public_state()
        }, room=room_code)
