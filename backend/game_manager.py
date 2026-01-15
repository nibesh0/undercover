"""Game room and state management."""

import random
from datetime import datetime
from game_logic import assign_roles, assign_words, check_win_condition, tally_votes


class Room:
    """Manages a game room with players and game state."""
    
    def __init__(self, room_code, host_id, host_name):
        self.room_code = room_code
        self.host_id = host_id
        self.created_at = datetime.now()
        
        # Game settings (configurable by host)
        self.undercover_count = 2  # Default: 2 undercovers
        
        # Game state
        self.phase = 'lobby'  # lobby, playing, voting, mr_white_guess, results
        self.players = {}  # {socket_id: player_data}
        self.turn_order = []
        self.current_turn_index = 0
        self.round_number = 1
        self.clues = []  # [{player_id, player_name, clue, round}]
        self.votes = {}  # {voter_id: voted_for_id}
        self.civilian_word = None
        self.undercover_word = None
        self.eliminated_player_id = None
        self.winner = None
        
        # Add host as first player
        self.add_player(host_id, host_name, is_host=True)
    
    def add_player(self, socket_id, player_name, is_host=False):
        """Add a player to the room."""
        # If room is empty, first player is always host
        if not self.players:
            is_host = True
            self.host_id = socket_id
        # If current host_id points to disconnected player, make this player host
        elif self.host_id not in self.players:
            is_host = True
            self.host_id = socket_id
            


        self.players[socket_id] = {
            'id': socket_id,
            'name': player_name,
            'is_host': is_host,
            'role': None,
            'word': None,
            'is_alive': True,
            'joined_at': datetime.now()
        }
    
    def remove_player(self, socket_id):
        """Remove a player from the room."""
        if socket_id in self.players:
            del self.players[socket_id]
            
            # If host left, assign new host
            if socket_id == self.host_id and self.players:
                new_host_id = list(self.players.keys())[0]
                self.host_id = new_host_id
                self.players[new_host_id]['is_host'] = True
    
    def start_game(self):
        """Initialize game with role and word assignments."""
        if len(self.players) < 4:
            raise ValueError("Need at least 4 players to start")
        
        player_ids = list(self.players.keys())
        player_count = len(player_ids)
        
        # Validate undercover count
        max_undercovers = player_count - 2  # At least 1 civilian + 1 mr white
        if self.undercover_count > max_undercovers:
            self.undercover_count = max_undercovers
        
        # Assign roles and words
        roles = assign_roles(player_count, self.undercover_count)
        words, civilian_word, undercover_word = assign_words(roles)
        
        self.civilian_word = civilian_word
        self.undercover_word = undercover_word
        
        # Assign to players
        for i, player_id in enumerate(player_ids):
            self.players[player_id]['role'] = roles[i]
            self.players[player_id]['word'] = words[i]
        
        # Set random turn order, ensuring Mr. White never goes first
        self.turn_order = player_ids.copy()
        random.shuffle(self.turn_order)
        
        # Check if first player is Mr. White
        first_player_id = self.turn_order[0]
        if self.players[first_player_id]['role'] == 'mrwhite':
            # Find a non-Mr. White player to swap with
            for i in range(1, len(self.turn_order)):
                if self.players[self.turn_order[i]]['role'] != 'mrwhite':
                    # Swap Mr. White with this player
                    self.turn_order[0], self.turn_order[i] = self.turn_order[i], self.turn_order[0]
                    break
        
        self.current_turn_index = 0
        self.phase = 'playing'
        self.round_number = 1
    
    def get_current_player(self):
        """Get the player whose turn it is."""
        if not self.turn_order:
            return None
        return self.turn_order[self.current_turn_index]
    
    def submit_clue(self, player_id, clue):
        """Submit a clue for the current player."""
        if player_id != self.get_current_player():
            raise ValueError("Not your turn")
        
        # Record clue
        self.clues.append({
            'player_id': player_id,
            'player_name': self.players[player_id]['name'],
            'clue': clue,
            'round': self.round_number
        })
        
        # Move to next player
        self.current_turn_index += 1
        
        # Check if round is complete
        alive_players = [pid for pid in self.turn_order if self.players[pid]['is_alive']]
        if self.current_turn_index >= len(alive_players):
            # Round complete, move to voting
            self.phase = 'voting'
            self.votes = {}
    
    def submit_vote(self, voter_id, voted_for_id):
        """Submit a vote for elimination."""
        if not self.players[voter_id]['is_alive']:
            raise ValueError("Dead players cannot vote")
        
        self.votes[voter_id] = voted_for_id
        
        # Check if all alive players have voted
        alive_players = [pid for pid in self.players if self.players[pid]['is_alive']]
        if len(self.votes) >= len(alive_players):
            # All votes in, process elimination
            self.process_votes()
    
    def process_votes(self):
        """Process votes and eliminate a player."""
        from game_logic import tally_votes
        
        eliminated_id, vote_counts = tally_votes(self.votes, list(self.players.values()))
        
        if eliminated_id:
            self.eliminated_player_id = eliminated_id
            eliminated_player = self.players[eliminated_id]
            eliminated_player['is_alive'] = False
            
            # Check if eliminated player is Mr. White
            if eliminated_player['role'] == 'mrwhite':
                self.phase = 'mr_white_guess'
            else:
                # Check win condition
                winner = check_win_condition(list(self.players.values()))
                if winner:
                    self.winner = winner
                    self.phase = 'results'
                else:
                    # Continue to next round
                    self.start_next_round()
    
    def start_next_round(self):
        """Start a new round of clue giving."""
        self.round_number += 1
        self.current_turn_index = 0
        self.votes = {}
        self.eliminated_player_id = None
        
        # Update turn order to only include alive players
        self.turn_order = [pid for pid in self.turn_order if self.players[pid]['is_alive']]
        
        self.phase = 'playing'
    
    def process_mr_white_guess(self, guess):
        """Process Mr. White's final guess."""
        from game_logic import validate_mr_white_guess
        
        if validate_mr_white_guess(guess, self.civilian_word):
            # Mr. White wins
            self.winner = 'mrwhite'
        else:
            # Check normal win condition
            self.winner = check_win_condition(list(self.players.values()))
        
        self.phase = 'results'
    
    def get_public_state(self):
        """Get public game state (no sensitive info)."""
        return {
            'room_code': self.room_code,
            'phase': self.phase,
            'player_count': len(self.players),
            'undercover_count': self.undercover_count,
            'players': [
                {
                    'id': p['id'],
                    'name': p['name'],
                    'is_host': p['is_host'],
                    'is_alive': p['is_alive']
                }
                for p in self.players.values()
            ],
            'current_turn': self.get_current_player() if self.phase == 'playing' else None,
            'round_number': self.round_number,
            'clues': self.clues,
            'winner': self.winner
        }
    
    def get_player_private_state(self, player_id):
        """Get private state for a specific player."""
        player = self.players.get(player_id)
        if not player:
            return None
        
        return {
            'role': player['role'],
            'word': player['word'],
            'is_alive': player['is_alive']
        }


class GameManager:
    """Manages all game rooms."""
    
    def __init__(self):
        self.rooms = {}  # {room_code: Room}
    
    def create_room(self, room_code, host_id, host_name):
        """Create a new game room."""
        room = Room(room_code, host_id, host_name)
        self.rooms[room_code] = room
        return room
    
    def get_room(self, room_code):
        """Get a room by code."""
        return self.rooms.get(room_code)
    
    def delete_room(self, room_code):
        """Delete a room."""
        if room_code in self.rooms:
            del self.rooms[room_code]
    
    def get_room_by_player(self, player_id):
        """Find which room a player is in."""
        for room in self.rooms.values():
            if player_id in room.players:
                return room
        return None
