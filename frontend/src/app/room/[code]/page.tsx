'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { connectSocket, removeAllSocketListeners } from '@/lib/socket';
import type { GameState, PlayerData } from '@/types/game';
import Lobby from '@/components/Lobby';
import GamePlay from '@/components/GamePlay';
import Voting from '@/components/Voting';
import MrWhiteGuess from '@/components/MrWhiteGuess';
import Results from '@/components/Results';

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();

    const roomCode = (params?.code as string)?.toUpperCase();
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [allPlayers, setAllPlayers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);



    // Get player name from sessionStorage on mount
    useEffect(() => {
        const storedName = sessionStorage.getItem('playerName');
        if (!storedName) {
            // If no name in session, redirect to home
            router.push('/');
            return;
        }
        setPlayerName(storedName);
    }, [router]);

    useEffect(() => {
        if (!roomCode || !playerName) return;
        const storedGameState = sessionStorage.getItem('gameState');
        const storedPlayerData = sessionStorage.getItem('playerData');
        const hasStoredState = storedGameState && storedPlayerData;
        if (hasStoredState) {
            setGameState(JSON.parse(storedGameState));
            setPlayerData(JSON.parse(storedPlayerData));
            sessionStorage.removeItem('gameState');
            sessionStorage.removeItem('playerData');
        }
        const socket = connectSocket();
        const handleJoin = () => {
            console.log('Socket connected, checking join...');
            setIsConnected(true);
            // Only join room if we don't have stored state (meaning we're joining, not creating)
            if (playerName && !hasStoredState) {
                console.log('Joining room:', roomCode, 'as', playerName);
                socket.emit('join_room', {
                    room_code: roomCode,
                    player_name: playerName,
                });
            } else if (hasStoredState) {
                console.log('Room created - using stored state, not joining');
            }
        };

        socket.on('connect', handleJoin);

        // If already connected, trigger join logic immediately
        if (socket.connected) {
            handleJoin();
        }

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Room events
        socket.on('room_created', (data) => {
            setGameState(data.game_state);
            setPlayerData(data.player_data);
        });

        socket.on('room_joined', (data) => {
            setGameState(data.game_state);
            setPlayerData(data.player_data);
        });

        socket.on('player_joined', (data) => {
            setGameState(data.game_state);
        });

        socket.on('player_left', (data) => {
            setGameState(data.game_state);
        });

        socket.on('settings_updated', (data) => {
            setGameState(data.game_state);
        });

        // Game events
        socket.on('game_started', (data) => {
            setGameState(data.game_state);
        });

        socket.on('role_assigned', (data) => {
            setPlayerData(data.player_data);
        });

        socket.on('clue_submitted', (data) => {
            setGameState(data.game_state);
        });

        socket.on('vote_submitted', (data) => {
            setGameState(data.game_state);
        });

        socket.on('game_ended', (data) => {
            console.log('Game ended event received:', data);
            setGameState(data.game_state);
            if (data.all_players) {
                setAllPlayers(data.all_players);
            }
        });

        socket.on('game_reset', (data) => {
            setGameState(data.game_state);
            // Reset player data
            setPlayerData({
                role: 'civilian',
                word: null,
                is_alive: true,
            });
        });

        socket.on('error', (data) => {
            setError(data.message);
            // If room not found, redirect to home
            if (data.message.includes('not found')) {
                setTimeout(() => router.push('/'), 2000);
            }
        });

        return () => {
            // Remove all event listeners but keep socket connected
            removeAllSocketListeners();
        };
    }, [roomCode, playerName, router]);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card-strong text-center space-y-4">
                    <div className="animate-pulse-slow text-4xl">🔌</div>
                    <p className="text-xl">Connecting to game...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card-strong text-center space-y-4">
                    <div className="text-4xl">❌</div>
                    <p className="text-xl text-red-400">{error}</p>
                    <button onClick={() => router.push('/')} className="btn btn-secondary">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card-strong text-center space-y-4">
                    <div className="animate-pulse-slow text-4xl">⏳</div>
                    <p className="text-xl">Loading game...</p>
                </div>
            </div>
        );
    }

    // Render based on game phase
    return (
        <div className="min-h-screen flex justify-center p-4">
            <div className="w-[900px] animate-fade-in">
                {gameState.phase === 'lobby' && (
                    <Lobby gameState={gameState} roomCode={roomCode} />
                )}
                {gameState.phase === 'playing' && (
                    <GamePlay
                        gameState={gameState}
                        playerData={playerData}
                        roomCode={roomCode}
                    />
                )}
                {gameState.phase === 'voting' && (
                    <Voting
                        gameState={gameState}
                        playerData={playerData}
                        roomCode={roomCode}
                    />
                )}
                {gameState.phase === 'mr_white_guess' && (
                    <MrWhiteGuess
                        gameState={gameState}
                        playerData={playerData}
                        roomCode={roomCode}
                    />
                )}
                {gameState.phase === 'results' && (
                    <Results
                        gameState={gameState}
                        roomCode={roomCode}
                        allPlayers={allPlayers}
                    />
                )}
            </div>
        </div>
    );
}
