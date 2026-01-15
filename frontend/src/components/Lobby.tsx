'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import { getPlayerAvatar } from '@/lib/avatars';
import type { GameState, PlayerData } from '@/types/game';
import {
    Gamepad2,
    Copy,
    Check,
    Users,
    Crown,
    Info,
    Circle
} from 'lucide-react';

interface LobbyProps {
    gameState: GameState;
    roomCode: string;
}

export default function Lobby({ gameState, roomCode }: LobbyProps) {
    const [copied, setCopied] = useState(false);
    const socket = getSocket();

    const currentPlayer = gameState.players.find(p => p.id === socket.id);
    const isHost = currentPlayer?.is_host || false;
    const canStart = gameState.player_count >= 4;

    const handleCopyCode = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartGame = () => {
        if (canStart) {
            socket.emit('start_game', { room_code: roomCode });
        }
    };



    return (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Gamepad2 size={32} color="#fbbf24" />
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>Game Lobby</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Room Code Card */}
                <div className="card-strong">
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Room Code
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '0.1em', color: '#fbbf24' }}>
                            {roomCode}
                        </span>
                        <button
                            onClick={handleCopyCode}
                            className="btn-secondary"
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', border: 'none', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Copy Code"
                        >
                            {copied ? (
                                <Check size={20} color="#10b981" />
                            ) : (
                                <Copy size={20} color="#94a3b8" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Players List */}
                <div className="card">
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} />
                        Players <span style={{ color: '#94a3b8' }}>({gameState.player_count})</span>
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {gameState.players.map((player, index) => (
                            <div key={player.id} className="player-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                                        {getPlayerAvatar(player.name, 24)}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: 500, color: '#f1f5f9' }}>
                                                {player.name}
                                            </span>
                                            {player.is_host && (
                                                <Crown size={14} color="#fbbf24" />
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.125rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}></div>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: Math.max(0, 4 - gameState.player_count) }).map((_, i) => (
                            <div key={`empty-${i}`} style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px dashed #334155',
                                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Circle size={12} color="#334155" />
                                </div>
                                <span style={{ color: '#64748b', fontSize: '0.875rem', fontStyle: 'italic' }}>Waiting for player...</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How to Play */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, color: '#e2e8f0', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Info size={18} color="#fbbf24" />
                        How to Play
                    </h3>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                            <span style={{ color: '#fbbf24', marginTop: '0.125rem' }}>•</span>
                            Each round, one player describes a secret word
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                            <span style={{ color: '#10b981', marginTop: '0.125rem' }}>•</span>
                            Others try to guess the word from the clues
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                            <span style={{ color: '#818cf8', marginTop: '0.125rem' }}>•</span>
                            First to guess correctly wins the round!
                        </li>
                    </ul>
                </div>

                {/* Game Settings (Host Only) */}
                {isHost && (
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 500, color: '#e2e8f0', marginBottom: '0.75rem' }}>Game Settings</h3>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.5rem' }}>
                                Number of Undercovers: {gameState.undercover_count || 2}
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3].map(count => {
                                    const maxUndercovers = gameState.player_count - 2;
                                    const isDisabled = count > maxUndercovers;
                                    const isSelected = (gameState.undercover_count || 2) === count;
                                    return (
                                        <button
                                            key={count}
                                            onClick={() => {
                                                if (!isDisabled) {
                                                    socket.emit('update_settings', {
                                                        room_code: roomCode,
                                                        undercover_count: count
                                                    });
                                                }
                                            }}
                                            disabled={isDisabled}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                borderRadius: '0.5rem',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                backgroundColor: isSelected ? '#fbbf24' : isDisabled ? '#334155' : '#1e293b',
                                                color: isSelected ? '#0f172a' : isDisabled ? '#64748b' : '#cbd5e1',
                                                border: isDisabled ? 'none' : '1px solid #475569',
                                                opacity: isDisabled ? 0.5 : 1,
                                                fontWeight: 600
                                            }}
                                        >
                                            {count}
                                        </button>
                                    );
                                })}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                {gameState.player_count < 4
                                    ? 'Need at least 4 players'
                                    : `Max ${gameState.player_count - 2} undercovers`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Start Button */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                {isHost ? (
                    <button
                        onClick={handleStartGame}
                        disabled={!canStart}
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '1.125rem', padding: '1rem' }}
                    >
                        {canStart ? 'Start Game' : `Waiting for ${4 - gameState.player_count} more players...`}
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div className="animate-spin" style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '3px solid #334155', borderTopColor: '#fbbf24' }}></div>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }} className="animate-pulse-slow">
                            Waiting for host to start...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
