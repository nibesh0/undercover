'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import { getPlayerAvatar } from '@/lib/avatars';
import type { GameState } from '@/types/game';
import { Trophy, Users, Circle, Triangle, Square, RotateCcw, DoorOpen } from 'lucide-react';

interface ResultsProps {
    gameState: GameState;
    roomCode: string;
    allPlayers?: any[];
}

export default function Results({ gameState, roomCode, allPlayers = [] }: ResultsProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const socket = getSocket();
    const router = useRouter();

    useEffect(() => {
        setShowConfetti(true);
    }, []);

    const handlePlayAgain = () => {
        socket.emit('play_again', { room_code: roomCode });
    };

    const handleLeave = () => {
        socket.emit('leave_room', { room_code: roomCode });
        router.push('/');
    };

    const getWinnerMessage = () => {
        if (gameState.winner === 'civilians') {
            return {
                title: 'Civilians Win!',
                message: 'All enemies have been eliminated!',
                color: 'text-green-400',
                icon: <Circle size={48} color="#10b981" fill="#10b981" />
            };
        }
        if (gameState.winner === 'undercovers') {
            return {
                title: 'Undercovers Win!',
                message: 'The infiltrators have prevailed!',
                color: 'text-yellow-400',
                icon: <Triangle size={48} color="#fbbf24" fill="#fbbf24" />
            };
        }
        if (gameState.winner === 'mrwhite') {
            return {
                title: 'Mr. White Wins!',
                message: 'Guessed the civilian word correctly!',
                color: 'text-red-400',
                icon: <Square size={48} color="#ef4444" fill="#ef4444" />
            };
        }

        // Fallback for null, undefined, or unexpected values
        return {
            title: `Game Over${gameState.winner ? ` (${gameState.winner})` : ''}`,
            message: 'Thanks for playing!',
            color: 'text-purple-400',
            icon: <Trophy size={48} color="#a855f7" />
        };
    };

    const winnerInfo = getWinnerMessage();

    const getRoleColor = (role: string) => {
        if (role === 'civilian') return 'border-green-500';
        if (role === 'undercover') return 'border-yellow-500';
        return 'border-red-500';
    };

    const getRoleIcon = (role: string, size: number = 32) => {
        if (role === 'civilian') return <Circle size={size} color="#10b981" fill="#10b981" />;
        if (role === 'undercover') return <Triangle size={size} color="#fbbf24" fill="#fbbf24" />;
        return <Square size={size} color="#ef4444" fill="#ef4444" />;
    };

    return (
        <div className="space-y-[2px] animate-fade-in">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-purple-500 rounded-full animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                animationDuration: `${2 + Math.random() * 3}s`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][
                                    Math.floor(Math.random() * 4)
                                ],
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Winner Announcement */}
            <div className="card-strong text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-full animate-pulse-slow">
                    <Trophy size={64} className="text-amber-400" />
                </div>
                <div className="mb-3">
                    {winnerInfo.icon}
                </div>
                <h1 className={`text-5xl font-bold ${winnerInfo.color}`}>
                    {winnerInfo.title}
                </h1>
                <p className="text-xl text-slate-400">{winnerInfo.message}</p>
            </div>

            {/* Player Roles Revealed */}
            <div className="card">
                <h2 className="text-2xl font-semibold mb-4 text-center text-slate-200 flex items-center justify-center gap-2">
                    <Users size={24} />
                    Roles Revealed
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(allPlayers.length > 0 ? allPlayers : gameState.players).map((player, index) => (
                        <div
                            key={player.id}
                            className={`glass rounded-lg p-4 border-2 ${getRoleColor(player.role || 'civilian')} bg-slate-800`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #334155',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getPlayerAvatar(player.name, 24)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(player.role || 'civilian', 20)}
                                        <div>
                                            <p className="font-semibold text-lg text-slate-200">{player.name}</p>
                                            <p className="text-sm text-slate-500 capitalize">
                                                {player.role || 'civilian'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-mono text-white font-bold">
                                        {player.word || 'No word'}
                                    </p>
                                    {!player.is_alive && (
                                        <p className="text-xs text-red-500 font-semibold">Eliminated</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={handlePlayAgain} className="btn btn-primary text-lg flex items-center justify-center gap-2">
                    <RotateCcw size={20} />
                    Play Again
                </button>
                <button onClick={handleLeave} className="btn btn-secondary text-lg flex items-center justify-center gap-2">
                    <DoorOpen size={20} />
                    Leave Game
                </button>
            </div>
        </div>
    );
}
