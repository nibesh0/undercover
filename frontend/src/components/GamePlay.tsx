'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import type { GameState, PlayerData } from '@/types/game';
import { Circle, Triangle, Square, Users, MessageCircle, FileText, Clock } from 'lucide-react';

interface GamePlayProps {
    gameState: GameState;
    playerData: PlayerData | null;
    roomCode: string;
}

export default function GamePlay({ gameState, playerData, roomCode }: GamePlayProps) {
    const [clue, setClue] = useState('');
    const socket = getSocket();

    const currentPlayer = gameState.players.find(p => p.id === socket.id);
    const isMyTurn = gameState.current_turn === socket.id;
    const currentTurnPlayer = gameState.players.find(p => p.id === gameState.current_turn);

    const handleSubmitClue = () => {
        if (!clue.trim()) {
            alert('Please enter a clue');
            return;
        }

        socket.emit('submit_clue', {
            room_code: roomCode,
            clue: clue.trim(),
        });

        setClue('');
    };

    const getRoleColor = (role: string) => {
        if (role === 'civilian') return 'role-civilian';
        if (role === 'undercover') return 'role-undercover';
        return 'role-mrwhite';
    };

    const getRoleIcon = (role: string, size: number = 48) => {
        if (role === 'civilian') return <Circle size={size} color="#10b981" fill="#10b981" />;
        if (role === 'undercover') return <Triangle size={size} color="#fbbf24" fill="#fbbf24" />;
        return <Square size={size} color="#ef4444" fill="#ef4444" />;
    };

    const getRoleName = (role: string) => {
        if (role === 'civilian') return 'Civilian';
        if (role === 'undercover') return 'Undercover';
        return 'Mr. White';
    };

    return (
        <div className="space-y-[2px] animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-200 mb-2">Round {gameState.round_number}</h1>
                <p className="text-slate-400">Describe your word without being too obvious!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Role & Word */}
                <div className="space-y-4">
                    {/* Role Card */}
                    {playerData && (
                        <div className={`role-card animate-flip ${getRoleColor(playerData.role)} shadow-xl`}>
                            <div className="mb-3">{getRoleIcon(playerData.role, 64)}</div>
                            <h2 className="text-2xl font-bold mb-2 text-slate-200">
                                You are {getRoleName(playerData.role)}
                            </h2>
                            {playerData.word ? (
                                <div className="mt-4">
                                    <p className="text-slate-400 text-sm mb-2">Your word:</p>
                                    <p className="text-3xl font-bold text-white">{playerData.word}</p>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <p className="text-slate-400 text-sm">You have no word!</p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Listen carefully and guess the word
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Players Status */}
                    <div className="card">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-200">
                            <Users size={18} />
                            Players ({gameState.players.filter(p => p.is_alive).length} alive)
                        </h3>
                        <div className="space-y-2">
                            {gameState.players.map((player) => (
                                <div
                                    key={player.id}
                                    className={`player-item ${!player.is_alive ? 'dead' : ''} ${player.id === gameState.current_turn ? 'turn-indicator' : ''
                                        }`}
                                >
                                    <span className="text-slate-300 font-medium">{player.name}</span>
                                    {player.id === gameState.current_turn && (
                                        <span className="text-purple-600 text-sm animate-pulse-slow flex items-center gap-1">
                                            <Clock size={14} />
                                            Thinking...
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Clues & Input */}
                <div className="space-y-4">
                    {/* Clue Input */}
                    {isMyTurn && playerData?.is_alive && (
                        <div className="card-strong animate-slide-in">
                            <h3 className="font-semibold text-xl mb-4 text-center text-slate-200 flex items-center justify-center gap-2">
                                <MessageCircle size={24} />
                                Your Turn!
                            </h3>
                            <input
                                type="text"
                                value={clue}
                                onChange={(e) => setClue(e.target.value)}
                                placeholder="Enter your one-word clue..."
                                className="input w-full mb-3"
                                maxLength={50}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitClue()}
                                autoFocus
                            />
                            <button
                                onClick={handleSubmitClue}
                                className="btn btn-primary w-full"
                            >
                                Submit Clue
                            </button>
                        </div>
                    )}

                    {!isMyTurn && (
                        <div className="card-strong text-center">
                            <p className="text-slate-400">
                                Waiting for <strong>{currentTurnPlayer?.name}</strong>
                            </p>
                            <div className="animate-pulse-slow mt-2">
                                <Clock size={48} className="mx-auto text-slate-400" />
                            </div>
                        </div>
                    )}

                    {/* Clues History */}
                    <div className="card">
                        <h3 className="font-semibold mb-3 text-slate-200 flex items-center gap-2">
                            <FileText size={18} />
                            Clues Given
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {gameState.clues.length === 0 && (
                                <p className="text-slate-500 text-sm text-center py-4">
                                    No clues yet...
                                </p>
                            )}
                            {gameState.clues.map((clue, index) => (
                                <div
                                    key={index}
                                    className="glass rounded-lg px-4 py-3 animate-slide-in bg-slate-800 border border-slate-700"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-purple-600">
                                                {clue.player_name}
                                            </p>
                                            <p className="text-xl mt-1 text-slate-200">{clue.clue}</p>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            R{clue.round}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
