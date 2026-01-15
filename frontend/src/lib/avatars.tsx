import {
    Cat, Dog, Bird, Rabbit, Squirrel, Fish, Turtle, Bug,
    Flame, Zap, Star, Moon, Sun, Cloud, Sparkles,
    Heart, Coffee, Cherry, Apple, Candy
} from 'lucide-react';
import React from 'react';

const PLAYER_AVATARS = [
    { Icon: Cat, color: '#fbbf24' },       // amber
    { Icon: Dog, color: '#f472b6' },       // pink
    { Icon: Bird, color: '#818cf8' },      // indigo
    { Icon: Rabbit, color: '#34d399' },    // emerald
    { Icon: Squirrel, color: '#fb923c' },  // orange
    { Icon: Fish, color: '#5eead4' },      // teal
    { Icon: Turtle, color: '#86efac' },    // green
    { Icon: Bug, color: '#a78bfa' },       // violet
    { Icon: Flame, color: '#ef4444' },     // red
    { Icon: Zap, color: '#fde047' },       // yellow
    { Icon: Star, color: '#f0abfc' },      // fuchsia
    { Icon: Moon, color: '#c4b5fd' },      // purple light
    { Icon: Sun, color: '#fcd34d' },       // amber light
    { Icon: Cloud, color: '#cbd5e1' },     // slate
    { Icon: Sparkles, color: '#d8b4fe' },  // purple
    { Icon: Heart, color: '#fda4af' },     // rose
    { Icon: Coffee, color: '#a16207' },    // amber dark
    { Icon: Cherry, color: '#dc2626' },    // red dark
    { Icon: Apple, color: '#16a34a' },     // green dark
    { Icon: Candy, color: '#d946ef' },     // fuchsia dark
];

export const getPlayerAvatar = (playerName: string, size: number = 24) => {
    // Create a simple hash from the player name for consistent avatar assignment
    let hash = 0;
    for (let i = 0; i < playerName.length; i++) {
        hash = playerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PLAYER_AVATARS.length;
    const { Icon, color } = PLAYER_AVATARS[index];

    return <Icon size={size} color={color} />;
};

export const getPlayerAvatarConfig = (playerName: string) => {
    let hash = 0;
    for (let i = 0; i < playerName.length; i++) {
        hash = playerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PLAYER_AVATARS.length;
    return PLAYER_AVATARS[index];
};
