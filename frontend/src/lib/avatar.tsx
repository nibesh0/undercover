import {
    User, Cat, Dog, Bird, Rabbit, Turtle, Fish, Snail, Bug,
    Zap, Flame, Droplet, Snowflake, Star, Moon, Sun, Cloud,
    Music, Heart, Skull, Rocket, Plane, Car, Bike, Anchor,
    Coffee, Pizza, Gamepad2, Ghost, Smile
} from 'lucide-react';
import React from 'react';

const AVATARS = [
    { icon: User, color: '#fca5a5' },      // red-300
    { icon: Cat, color: '#fdba74' },       // orange-300
    { icon: Dog, color: '#fcd34d' },       // amber-300
    { icon: Bird, color: '#bef264' },      // lime-300
    { icon: Rabbit, color: '#86efac' },    // green-300
    { icon: Turtle, color: '#6ee7b7' },    // emerald-300
    { icon: Fish, color: '#5eead4' },      // teal-300
    { icon: Snail, color: '#67e8f9' },     // cyan-300
    { icon: Bug, color: '#7dd3fc' },       // sky-300
    { icon: Zap, color: '#93c5fd' },       // blue-300
    { icon: Flame, color: '#a5b4fc' },     // indigo-300
    { icon: Droplet, color: '#c4b5fd' },   // violet-300
    { icon: Snowflake, color: '#d8b4fe' }, // purple-300
    { icon: Star, color: '#f0abfc' },      // fuchsia-300
    { icon: Moon, color: '#f9a8d4' },      // pink-300
    { icon: Sun, color: '#fda4af' },       // rose-300
    { icon: Cloud, color: '#e2e8f0' },     // slate-200
    { icon: Music, color: '#fde047' },     // yellow-300
    { icon: Rocket, color: '#ef4444' },    // red-500
    { icon: Gamepad2, color: '#a855f7' },  // purple-500
];

export const getPlayerAvatar = (name: string, size: number = 24) => {
    // Simple hash function to get consistent index from name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATARS.length;
    const { icon: Icon, color } = AVATARS[index];

    return <Icon size={size} color={color} />;
};

export const getAvatarConfig = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATARS.length;
    return AVATARS[index];
};
