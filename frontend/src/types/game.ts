/**
 * TypeScript types for Undercover game
 */

export type Role = 'civilian' | 'undercover' | 'mrwhite';

export type GamePhase = 'lobby' | 'playing' | 'voting' | 'mr_white_guess' | 'results';

export interface Player {
    id: string;
    name: string;
    is_host: boolean;
    is_alive: boolean;
    role?: Role;
    word?: string | null;
}

export interface Clue {
    player_id: string;
    player_name: string;
    clue: string;
    round: number;
}

export interface GameState {
    room_code: string;
    phase: GamePhase;
    player_count: number;
    undercover_count: number;
    players: Player[];
    current_turn: string | null;
    round_number: number;
    clues: Clue[];
    winner: 'civilians' | 'undercovers' | 'mrwhite' | null;
}

export interface PlayerData {
    role: Role;
    word: string | null;
    is_alive: boolean;
}

// Socket event types
export interface SocketEvents {
    // Client -> Server
    create_room: (data: { player_name: string }) => void;
    join_room: (data: { room_code: string; player_name: string }) => void;
    leave_room: (data: { room_code: string }) => void;
    start_game: (data: { room_code: string }) => void;
    submit_clue: (data: { room_code: string; clue: string }) => void;
    submit_vote: (data: { room_code: string; voted_for_id: string }) => void;
    mr_white_guess: (data: { room_code: string; guess: string }) => void;
    play_again: (data: { room_code: string }) => void;

    // Server -> Client
    connected: (data: { message: string }) => void;
    room_created: (data: { room_code: string; game_state: GameState; player_data: PlayerData }) => void;
    room_joined: (data: { room_code: string; game_state: GameState; player_data: PlayerData }) => void;
    player_joined: (data: { game_state: GameState }) => void;
    player_left: (data: { player_id: string; game_state: GameState }) => void;
    game_started: (data: { game_state: GameState }) => void;
    role_assigned: (data: { player_data: PlayerData }) => void;
    clue_submitted: (data: { game_state: GameState }) => void;
    vote_submitted: (data: { game_state: GameState; eliminated_player_id: string | null }) => void;
    game_ended: (data: {
        game_state: GameState;
        all_players: Player[];
        civilian_word: string;
        undercover_word: string;
        mr_white_guess?: string;
    }) => void;
    game_reset: (data: { game_state: GameState }) => void;
    error: (data: { message: string }) => void;
}
