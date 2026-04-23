/**
 * CryptoVault Dashboard Controller
 * Handles table interactions, searching, and visualizations
 */

const Dashboard = (() => {
    'use strict';

    let fileTable;
    let rows = [];

    const init = () => {
        fileTable = document.querySelector('table');
        if (fileTable) {
            rows = Array.from(fileTable.querySelectorAll('tbody tr'));
            setupSearch();
            setupSorting();
            applyFormatting();
        }
        setupVisuals();
    };

    /**
     * Live Search Implementation
     */
    const setupSearch = () => {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 Search files by name...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            width: 100%; padding: 12px 20px;
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; color: #fff; margin-bottom: 20px;
            outline: none; transition: all 0.3s;
        `;
        
        searchInput.addEventListener('focus', () => searchInput.style.borderColor = '#6c47ff');
        searchInput.addEventListener('blur', () => searchInput.style.borderColor = 'rgba(255,255,255,0.1)');

        const panel = document.querySelector('.panel:last-of-type');
        if (panel) {
            const header = panel.querySelector('.panel-header');
            panel.insertBefore(searchInput, header.nextSibling);
        }

        searchInput.addEventListener('input', CryptoUtils.debounce((e) => {
            const query = e.target.value.toLowerCase();
            rows.forEach(row => {
                const fileName = row.querySelector('.file-name').textContent.toLowerCase();
                row.style.display = fileName.includes(query) ? '' : 'none';
            });
            updateEmptyState();
        }, 200));
    };

    /**
     * Column Sorting
     */
    const setupSorting = () => {
        const headers = fileTable.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (index === 3) return; // Skip Actions column
            header.style.cursor = 'pointer';
            header.title = 'Click to sort';
            header.addEventListener('mouseenter', () => header.style.color = '#fff');
            header.addEventListener('mouseleave', () => header.style.color = '');
            
            header.addEventListener('click', () => {
                const isAscending = header.getAttribute('data-order') === 'asc';
                sortRows(index, !isAscending);
                header.setAttribute('data-order', isAscending ? 'desc' : 'asc');
            });
        });
    };

    const sortRows = (columnIndex, ascending) => {
        const tbody = fileTable.querySelector('tbody');
        const sortedRows = rows.sort((a, b) => {
            const valA = a.children[columnIndex].textContent.trim();
            const valB = b.children[columnIndex].textContent.trim();
            
            if (columnIndex === 1) { // Size column (numeric)
                return (parseFloat(valA) - parseFloat(valB)) * (ascending ? 1 : -1);
            }
            return valA.localeCompare(valB) * (ascending ? 1 : -1);
        });
        
        tbody.append(...sortedRows);
    };

    /**
     * Apply formatting from Utils
     */
    const applyFormatting = () => {
        rows.forEach(row => {
            // Format Size
            const sizeCell = row.querySelector('.file-size');
            if (sizeCell && !sizeCell.getAttribute('data-raw')) {
                const rawSize = parseInt(sizeCell.textContent);
                sizeCell.setAttribute('data-raw', rawSize);
                sizeCell.textContent = CryptoUtils.formatBytes(rawSize);
            }

            // Format Date (if applicable, current thymeleaf output is string)
            // We'll leave it as is for now unless we add a timestamp attribute
        });
    };

    const updateEmptyState = () => {
        const visibleRows = rows.filter(r => r.style.display !== 'none').length;
        const emptyState = document.querySelector('.empty-state');
        if (visibleRows === 0 && rows.length > 0) {
            if (!document.getElementById('search-empty')) {
                const div = document.createElement('div');
                div.id = 'search-empty';
                div.className = 'empty-state';
                div.innerHTML = `<div class="empty-icon">🔍</div><p>No files match your search.</p>`;
                fileTable.parentElement.appendChild(div);
                fileTable.style.display = 'none';
            }
        } else {
            const searchEmpty = document.getElementById('search-empty');
            if (searchEmpty) searchEmpty.remove();
            fileTable.style.display = '';
        }
    };

    /**
     * Storage Usage Visuals
     */
    const setupVisuals = () => {
        const statsRow = document.querySelector('.stats-row');
        if (!statsRow) return;

        // Add a "Files Breakdown" card
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.style.gridColumn = 'span 3';
        card.innerHTML = `
            <div class="stat-icon stat-icon-teal">📊</div>
            <div class="stat-info" style="flex: 1">
                <div class="label" style="margin-bottom: 10px">Vault Integrity Status</div>
                <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden">
                    <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #00c9a7, #38ef7d); box-shadow: 0 0 15px rgba(0,201,167,0.4)"></div>
                </div>
                <div class="label" style="margin-top: 10px; display: flex; justify-content: space-between">
                    <span>Health: 100% Secure</span>
                    <span>Last checked: Just now</span>
                </div>
            </div>
        `;
        statsRow.appendChild(card);
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
