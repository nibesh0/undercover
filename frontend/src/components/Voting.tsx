'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import { getPlayerAvatar } from '@/lib/avatars';
import type { GameState, PlayerData } from '@/types/game';
import { Vote, CheckCircle2, Clock, FileText, Crown } from 'lucide-react';

interface VotingProps {
    gameState: GameState;
    playerData: PlayerData | null;
    roomCode: string;
}

export default function Voting({ gameState, playerData, roomCode }: VotingProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const socket = getSocket();

    const alivePlayers = gameState.players.filter(p => p.is_alive);
    const currentPlayer = gameState.players.find(p => p.id === socket.id);

    const handleVote = () => {
        if (!selectedPlayer) {
            alert('Please select a player to vote for');
            return;
        }

        socket.emit('submit_vote', {
            room_code: roomCode,
            voted_for_id: selectedPlayer,
        });

        setHasVoted(true);
    };

    return (
        <div className="space-y-[2px] animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-3">
                    <Vote size={32} className="text-red-400" />
                </div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#e2e8f0' }}>Voting Time</h1>
                <p style={{ color: '#94a3b8' }}>Who do you think is Undercover or Mr. White?</p>
            </div>

            {/* Voting Grid */}
            {!hasVoted && currentPlayer?.is_alive ? (
                <div className="space-y-4">
                    <div className="card">
                        <h3 className="font-semibold mb-4" style={{ color: '#cbd5e1' }}>Select a player to eliminate:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {alivePlayers
                                .filter(p => p.id !== socket.id) // Can't vote for yourself
                                .map((player) => (
                                    <button
                                        key={player.id}
                                        onClick={() => setSelectedPlayer(player.id)}
                                        className={`card-strong text-left transition-all ${selectedPlayer === player.id
                                            ? 'ring-2 ring-purple-500 scale-105'
                                            : 'hover:scale-102'
                                            }`}
                                        style={{ width: '100%', display: 'block' }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: '#0f172a',
                                                border: '1px solid #334155',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {getPlayerAvatar(player.name, 20)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-lg" style={{ color: '#f1f5f9' }}>{player.name}</p>
                                                    {player.is_host && <Crown size={14} color="#fbbf24" />}
                                                </div>
                                                {selectedPlayer === player.id && (
                                                    <p className="text-sm text-purple-400 flex items-center gap-1">
                                                        <CheckCircle2 size={14} />
                                                        Selected
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={handleVote}
                        disabled={!selectedPlayer}
                        className={`btn w-full text-lg ${selectedPlayer ? 'btn-danger' : 'btn-secondary opacity-50 cursor-not-allowed'
                            }`}
                    >
                        {selectedPlayer ? (
                            <span className="flex items-center gap-2">
                                <Vote size={20} />
                                Confirm Vote
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Clock size={20} />
                                Select a player
                            </span>
                        )}
                    </button>
                </div>
            ) : (
                <div className="card-strong text-center space-y-4">
                    <div className="animate-pulse-slow">
                        <Clock size={64} className="mx-auto text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-semibold" style={{ color: '#e2e8f0' }}>
                        {currentPlayer?.is_alive ? 'Vote submitted!' : 'You are eliminated'}
                    </h2>
                    <p style={{ color: '#94a3b8' }}>
                        Waiting for other players to vote...
                    </p>
                </div>
            )}

            {/* Recent Clues Reference */}
            <div className="card">
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e2e8f0' }}>
                    <FileText size={18} />
                    Recent Clues
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {gameState.clues.slice(-8).map((clue, index) => (
                        <div key={index} className="glass rounded px-3 py-2 text-sm bg-slate-800 border border-slate-700">
                            <strong className="text-purple-400">{clue.player_name}:</strong>{' '}
                            <span style={{ color: '#cbd5e1' }}>{clue.clue}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
