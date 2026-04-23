/**
 * CryptoVault Utility Suite
 * Common helper functions for formatting and UI interactions
 */

const CryptoUtils = (() => {
    'use strict';

    /**
     * Formats bytes into human-readable string
     */
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    /**
     * Formats a date into a relative string (e.g., "3 minutes ago")
     */
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) return date.toLocaleDateString();
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    /**
     * Reusable clipboard helper
     */
    const copyToClipboard = (text, successMessage = "Copied to clipboard!") => {
        navigator.clipboard.writeText(text).then(() => {
            if (window.CryptoSecurity) {
                CryptoSecurity.showToast(successMessage);
            } else {
                alert(successMessage);
            }
        });
    };

    /**
     * Debounce helper for search inputs
     */
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    return {
        formatBytes,
        formatRelativeTime,
        copyToClipboard,
        debounce
    };
})();
