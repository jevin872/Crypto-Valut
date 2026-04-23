/**
 * CryptoVault Admin Controller
 * Handles administrative panel interactions and searching
 */

const Admin = (() => {
    'use strict';

    const init = () => {
        setupGlobalSearch();
    };

    const setupGlobalSearch = () => {
        const searchInput = document.createElement('input');
        searchInput.placeholder = '🔍 Search users or files...';
        searchInput.style.cssText = `
            width: 100%; padding: 12px 20px;
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; color: #fff; margin: 20px 0;
            outline: none; transition: all 0.3s;
        `;
        
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            const clone = searchInput.cloneNode(true);
            const header = panel.querySelector('.panel-header');
            if (header) {
                panel.insertBefore(clone, header.nextSibling);
            }
            
            clone.addEventListener('input', CryptoUtils.debounce((e) => {
                const query = e.target.value.toLowerCase();
                const rows = panel.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
                });
            }, 200));
        });
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', Admin.init);
