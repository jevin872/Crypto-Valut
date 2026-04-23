/**
 * CryptoVault Security Suite
 * Advanced Client-Side Security Enhancements
 */

const CryptoSecurity = (() => {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        sessionTimeout: 15 * 60 * 1000, // 15 minutes
        developerConsoleCheck: true,
        blockRightClick: true,
        blockDevToolsKeys: true,
        sanitizeInputs: true
    };

    let sessionTimer;

    // --- Initialization ---
    const init = () => {
        console.log("%c🛡️ CryptoVault Security Active", "color: #00c9a7; font-size: 20px; font-weight: bold;");
        console.log("%cWarning: This area is for developers only. If someone told you to paste code here, it is a scam.", "color: red; font-size: 14px;");

        if (CONFIG.blockRightClick) handleRightClick();
        if (CONFIG.blockDevToolsKeys) handleDevToolsKeys();
        if (CONFIG.developerConsoleCheck) startConsoleDetection();
        if (CONFIG.sanitizeInputs) attachSanitizers();
        
        resetSessionTimer();
        attachActivityListeners();
    };

    // --- DevTools Protection ---
    const handleRightClick = () => {
        document.addEventListener('contextmenu', (e) => {
            // Allow right click on inputs only
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                showSecurityToast("Right-click is disabled for security reasons.");
            }
        });
    };

    const handleDevToolsKeys = () => {
        document.addEventListener('keydown', (e) => {
            // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && e.keyCode === 85)
            ) {
                e.preventDefault();
                showSecurityToast("Developer tools are restricted.");
                return false;
            }
        });
    };

    const startConsoleDetection = () => {
        const threshold = 160;
        setInterval(() => {
            if (window.outerWidth - window.innerWidth > threshold || 
                window.outerHeight - window.innerHeight > threshold) {
                // Console might be open
                // In a real app, you might log this or redirect, but for now we just warn
            }
        }, 1000);
    };

    // --- Input Hardening ---
    const attachSanitizers = () => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"], textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const originalValue = e.target.value;
                const sanitized = sanitize(originalValue);
                if (originalValue !== sanitized) {
                    e.target.value = sanitized;
                    showSecurityToast("Potentially unsafe characters removed.");
                }
            });
        });
    };

    const sanitize = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML.replace(/[<>]/g, ''); // Simple XSS stripping
    };

    // --- Session Management ---
    const resetSessionTimer = () => {
        clearTimeout(sessionTimer);
        sessionTimer = setTimeout(() => {
            showSecurityToast("Session expiring soon due to inactivity.");
            // Logic to logout or refresh could go here
        }, CONFIG.sessionTimeout - 60000); // Alert 1 min before
    };

    const attachActivityListeners = () => {
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(name => {
            document.addEventListener(name, resetSessionTimer, true);
        });
    };

    // --- UI Helpers ---
    const showSecurityToast = (message) => {
        let toast = document.getElementById('security-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'security-toast';
            toast.style.cssText = `
                position: fixed; bottom: 20px; right: 20px;
                background: rgba(255, 68, 68, 0.9); color: white;
                padding: 12px 24px; border-radius: 12px;
                font-size: 0.85rem; font-weight: 600; z-index: 9999;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transform: translateY(100px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = "🛡️ " + message;
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.transform = 'translateY(150px)';
        }, 3000);
    };

    // --- Password Strength Utility ---
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (!password) return 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    // --- CSRF Protection ---
    const getCsrfData = () => {
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const headerName = document.querySelector('meta[name="_csrf_header"]')?.content;
        return { token, headerName };
    };

    const fetchWithCsrf = async (url, options = {}) => {
        const { token, headerName } = getCsrfData();
        if (token && headerName) {
            options.headers = {
                ...options.headers,
                [headerName]: token
            };
        }
        return fetch(url, options);
    };

    return {
        init,
        calculatePasswordStrength,
        getCsrfData,
        fetchWithCsrf,
        showToast: showSecurityToast
    };
})();

// Auto-init on DOM load
document.addEventListener('DOMContentLoaded', CryptoSecurity.init);
