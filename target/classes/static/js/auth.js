/**
 * CryptoVault Authentication Controller
 * Handles login, registration, and form interactions
 */

const Auth = (() => {
    'use strict';

    const init = () => {
        setupFormAnimations();
        setupInputListeners();
    };

    const setupFormAnimations = () => {
        const card = document.querySelector('.card');
        if (card) {
            // Add subtle mouse-tilt effect to cards
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 10;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;
                card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
            });
        }
    };

    const setupInputListeners = () => {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            // Wrap in parent for better focus styling if needed
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    };

    /**
     * Enhanced Password Visibility Toggle (Common Feature)
     */
    const togglePassword = (inputId) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    };

    return { 
        init,
        togglePassword
    };
})();

// Auto-init for auth pages
document.addEventListener('DOMContentLoaded', Auth.init);
