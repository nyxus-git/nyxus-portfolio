"use client";

import React from 'react';

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-gray-950 pointer-events-none">
            {/* Soft gradient base */}
            <div className="absolute inset-0 bg-gradient-radial from-gray-900 to-black opacity-80" />

            {/* Animated glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

            {/* Overlay Mesh/Noise if needed (can add texture later) */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        </div>
    );
}
