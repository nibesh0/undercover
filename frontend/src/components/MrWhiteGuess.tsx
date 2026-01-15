'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import type { GameState, PlayerData } from '@/types/game';
import { Target, Clock, Square, Send } from 'lucide-react';

interface MrWhiteGuessProps {
    gameState: GameState;
    playerData: PlayerData | null;
    roomCode: string;
}

export default function MrWhiteGuess({ gameState, playerData, roomCode }: MrWhiteGuessProps) {
    const [guess, setGuess] = useState('');
    const [hasGuessed, setHasGuessed] = useState(false);
    const socket = getSocket();

    const currentPlayer = gameState.players.find(p => p.id === socket.id);
    const isMrWhite = playerData?.role === 'mrwhite';

    const handleSubmitGuess = () => {
        if (!guess.trim()) {
            alert('Please enter your guess');
            return;
        }

        socket.emit('mr_white_guess', {
            room_code: roomCode,
            guess: guess.trim(),
        });

        setHasGuessed(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-[2px] animate-fade-in">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-3">
                        <Square size={32} className="text-red-400" fill="currentColor" />
                    </div>
                    <h1 className="text-5xl font-bold text-slate-400 mb-2">
                        Mr. White's Final Guess
                    </h1>
                    <p className="text-slate-400">
                        Make your guess to win the game!
                    </p>
                </div>

                {isMrWhite && !hasGuessed ? (
                    <div className="card-strong space-y-6">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full">
                                <Target size={48} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-200">
                                You've been eliminated!
                            </h2>
                            <p className="text-slate-400">
                                But you have ONE chance to guess the Civilian word and win!
                            </p>
                        </div>

                        {/* Clues Reference */}
                        <div className="card bg-slate-800 border border-slate-700">
                            <h3 className="font-semibold mb-3 text-purple-600">
                                Review the clues:
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {gameState.clues.map((clue, index) => (
                                    <div key={index} className="text-sm">
                                        <strong className="text-purple-600">{clue.player_name}:</strong>{' '}
                                        <span className="text-slate-300">{clue.clue}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Guess Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Your Guess
                            </label>
                            <input
                                type="text"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                placeholder="What is the civilian word?"
                                className="input w-full mb-4"
                                maxLength={50}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitGuess()}
                                autoFocus
                            />
                            <button
                                onClick={handleSubmitGuess}
                                className="btn btn-danger w-full text-lg flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Submit Final Guess
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card-strong text-center space-y-4">
                        <div className="animate-pulse-slow">
                            <Clock size={64} className="mx-auto text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-200">
                            {isMrWhite ? 'Guess submitted!' : 'Mr. White is guessing...'}
                        </h2>
                        <p className="text-slate-400">
                            {isMrWhite
                                ? 'Let\'s see if you guessed correctly!'
                                : 'Waiting for Mr. White to make their final guess...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
