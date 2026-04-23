/**
 * CryptoVault Global UI Controller
 * Handles parallax, typewriter effects, and scroll reveals
 */

const UI = (() => {
    'use strict';

    const init = () => {
        setupParallax();
        setupTypewriter();
        setupScrollReveal();
        setupNavbar();
    };

    const setupParallax = () => {
        document.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.orb');
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            
            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 30;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    };

    const setupTypewriter = () => {
        const line = document.querySelector('.line2');
        if (!line) return;
        const text = line.textContent;
        line.textContent = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                line.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        };
        setTimeout(type, 1500);
    };

    const setupScrollReveal = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .about-inner, .creator-card, .tech-badge').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            observer.observe(el);
        });
    };

    const setupNavbar = () => {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (nav) {
                nav.style.padding = window.scrollY > 40 ? '10px 60px' : '16px 60px';
                nav.style.background = window.scrollY > 40 ? 'rgba(6,6,15,0.9)' : 'rgba(6,6,15,0.6)';
            }
        });
    };

    return { init };
})();

// Auto-init on load
document.addEventListener('DOMContentLoaded', UI.init);
