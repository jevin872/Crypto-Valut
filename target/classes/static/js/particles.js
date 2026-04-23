/**
 * CryptoVault Particle Engine
 * A lightweight, high-performance particle system for background effects
 */

const ParticleEngine = (() => {
    'use strict';

    const init = (containerId, options = {}) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const count = options.count || 50;
        const color = options.color || 'rgba(255, 255, 255, 0.5)';
        const minSize = options.minSize || 1;
        const maxSize = options.maxSize || 3;
        const minDuration = options.minDuration || 6;
        const maxDuration = options.maxDuration || 20;

        container.innerHTML = ''; // Clear existing

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            
            const size = (minSize + Math.random() * (maxSize - minSize)) + 'px';
            const duration = (minDuration + Math.random() * (maxDuration - minDuration)) + 's';
            const delay = (Math.random() * maxDuration) + 's';
            const left = (Math.random() * 100) + 'vw';
            
            p.style.cssText = `
                position: absolute;
                width: ${size};
                height: ${size};
                background: ${color};
                border-radius: 50%;
                left: ${left};
                bottom: -10px;
                opacity: ${Math.random() * 0.8};
                animation: particle-rise ${duration} linear infinite;
                animation-delay: ${delay};
                pointer-events: none;
            `;

            // If keyframes aren't in CSS, we add them once
            ensureKeyframes();
            container.appendChild(p);
        }
    };

    const ensureKeyframes = () => {
        if (!document.getElementById('particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.innerHTML = `
                @keyframes particle-rise {
                    from { transform: translateY(100vh) scale(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 0.5; }
                    to { transform: translateY(-10vh) scale(1.2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    return { init };
})();
