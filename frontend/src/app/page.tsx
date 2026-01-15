'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { connectSocket } from '@/lib/socket';
import { Gamepad2, DoorOpen } from 'lucide-react';

export default function HomePage() {
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const handleCreateRoom = () => {
        if (!playerName.trim()) {
            alert('Please enter your name');
            return;
        }

        setIsCreating(true);
        const socket = connectSocket();

        socket.emit('create_room', { player_name: playerName });

        socket.once('room_created', (data) => {
            setIsCreating(false);
            // Store the initial game state and player data in sessionStorage
            sessionStorage.setItem('gameState', JSON.stringify(data.game_state));
            sessionStorage.setItem('playerData', JSON.stringify(data.player_data));
            // Store player name for reconnection
            sessionStorage.setItem('playerName', playerName);
            // Navigate without query params
            router.push(`/room/${data.room_code}`);
        });

        socket.once('error', (data) => {
            setIsCreating(false);
            alert(data.message);
        });
    };

    const handleJoinRoom = () => {
        if (!playerName.trim()) {
            alert('Please enter your name');
            return;
        }

        if (!roomCode.trim()) {
            alert('Please enter room code');
            return;
        }

        // Store player name in sessionStorage
        sessionStorage.setItem('playerName', playerName);
        // Navigate without query params
        router.push(`/room/${roomCode.toUpperCase()}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-[900px] space-y-5 animate-fade-in">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-bold text-white mb-1">
                        Undercover
                    </h1>
                    <p className="text-gray-200 text-sm">
                        A Social Deduction Game
                    </p>
                </div>

                {/* Main Card */}
                <div className="card-strong space-y-4">
                    {/* Player Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            inputMode="text"
                            autoComplete="name"
                            autoCorrect="off"
                            autoCapitalize="words"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                            className="input py-2.5 text-base"
                            maxLength={20}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                        />
                    </div>

                    {/* Create Room Button */}
                    <button
                        onClick={handleCreateRoom}
                        disabled={isCreating}
                        className="btn btn-primary w-full text-lg py-2.5"
                    >
                        {isCreating ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                Creating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Gamepad2 size={20} />
                                Host New Game
                            </span>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Join Room Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Code
                        </label>
                        <input
                            type="text"
                            inputMode="text"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="characters"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="Enter 6-digit code"
                            className="input mb-3 py-2.5 text-base"
                            maxLength={6}
                            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                        />
                        <button
                            onClick={handleJoinRoom}
                            className="btn btn-secondary w-full text-lg py-2.5 flex items-center justify-center gap-2"
                        >
                            <DoorOpen size={20} />
                            Join Game
                        </button>
                    </div>
                </div>

                {/* How to Play */}
                <div className="card text-center py-4 px-5">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">How to Play</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Find who's Undercover and Mr. White through word clues while hiding your identity!
                    </p>
                </div>
            </div>
        </div>
    );
}
