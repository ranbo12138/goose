import { colorMap, mapData, tagColorMap } from './config.js';
import { state, getCurrentPlayers } from './state.js';

export function vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
}

export function renderGrid(onCellClick) {
    const grid = document.getElementById('grid');
    const allPlayers = getCurrentPlayers();
    const players = allPlayers.slice(0, state.playerCount);  // 只取前N个
    const fragment = document.createDocumentFragment();

    // 更新网格布局类
    grid.className = 'grid-container';
    grid.classList.add(`mode-${state.playerCount}`);

    players.forEach(p => {
        const cell = document.createElement('div');
        cell.className = `cell ${p.selected ? 'selected' : ''} ${p.hasKnife ? 'has-knife' : ''}`;
        cell.onclick = () => onCellClick(p.id);
        
        const c = colorMap[p.id - 1];
        const displayTags = buildDisplayTags(p, allPlayers);
        const tagsHtml = displayTags.map(t => 
            `<span class="mini-tag" style="${t.style}">${t.text}</span>`
        ).join('');

        cell.innerHTML = `
            <div class="cell-id-bar" style="background:${c.bg}; color:${c.fg}">${p.id}</div>
            <div class="knife-badge">🔪</div>
            <div class="cell-tags">${tagsHtml}</div>
        `;
        fragment.appendChild(cell);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
}

function buildDisplayTags(player, players) {
    const displayTags = [];
    const skipTags = new Set();

    player.tags.forEach(tag => {
        let match = tag.text.match(/^保(\d+)$/);
        if (match) {
            const targetId = parseInt(match[1]);
            const targetPlayer = players[targetId - 1];
            if (targetPlayer?.tags.some(t => t.text === `保${player.id}`)) {
                const minC = colorMap[Math.min(player.id, targetId) - 1];
                const maxC = colorMap[Math.max(player.id, targetId) - 1];
                displayTags.push({
                    text: `${Math.min(player.id, targetId)},${Math.max(player.id, targetId)}互保`,
                    style: `background: linear-gradient(90deg, ${minC.bg} 50%, ${maxC.bg} 50%); color: #fff; text-shadow: 0 0 2px #000; border: 1px solid #777;`
                });
                skipTags.add(tag.text);
                skipTags.add(`被${targetId}保`);
            }
        }

        match = tag.text.match(/^🦶踩(\d+)$/);
        if (match) {
            const targetId = parseInt(match[1]);
            const targetPlayer = players[targetId - 1];
            if (targetPlayer?.tags.some(t => t.text === `🦶踩${player.id}`)) {
                const minC = colorMap[Math.min(player.id, targetId) - 1];
                const maxC = colorMap[Math.max(player.id, targetId) - 1];
                displayTags.push({
                    text: `${Math.min(player.id, targetId)},${Math.max(player.id, targetId)}互踩`,
                    style: `background: linear-gradient(90deg, ${minC.bg} 50%, ${maxC.bg} 50%); color: #fff; text-shadow: 0 0 2px #000; border: 1px solid #ef5350;`
                });
                skipTags.add(tag.text);
                skipTags.add(`被${targetId}🦶`);
            }
        }
    });

    player.tags.forEach(t => {
        if (!skipTags.has(t.text)) {
            displayTags.push({ text: t.text, style: `background:${t.bg}; color:${t.fg}` });
        }
    });

    return displayTags;
}

export function updateModeBar() {
    const bar = document.getElementById('modeBar');
    bar.className = `mode-bar ${state.currentMode} ${state.currentMode !== 'normal' ? 'active' : ''}`;
    
    if (state.currentMode !== 'normal') {
        const texts = {
            'knife': '🔪 点击标记有刀 (点击即完成)',
            'walk': state.tempId ? '👫 和谁一起？' : '👫 谁和谁一起？',
            'report': state.tempId ? '🦶 踩了谁？' : '🦶 踩了谁？',
            'vouch': state.tempId ? '🛡️ 保了谁？' : '🛡️ 保了谁？'
        };
        bar.innerText = texts[state.currentMode] || '';
    }
}

export function updateRoundDisplay() {
    document.getElementById('roundTrigger').innerHTML = `第 ${state.currentRound} 轮 ▼`;
    document.querySelectorAll('.round-option').forEach((opt, idx) => {
        opt.classList.toggle('active', idx + 1 === state.currentRound);
    });
}

export function updateControlButtons() {
    document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
    if (state.currentMode !== 'normal') {
        const map = {'report':'btn-report', 'vouch':'btn-vouch', 'knife':'btn-knife', 'walk':'btn-walk'};
        document.getElementById(map[state.currentMode])?.classList.add('active');
    }
}

export function toggleRoundPanel() {
    document.getElementById('roundPanel').classList.toggle('open');
}

export function closeRoundPanel() {
    document.getElementById('roundPanel').classList.remove('open');
}

export function openModal(id) {
    document.getElementById(id).classList.add('active');
}

export function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
}

export function renderTagManager() {
    const list = document.getElementById('customTagList');
    list.innerHTML = '';
    state.activeTags.forEach((t, index) => {
        const el = document.createElement('div');
        el.className = 'tag-edit-item';
        el.innerHTML = `${t.t} <span class="del-btn" data-index="${index}">×</span>`;
        list.appendChild(el);
    });
}

export function renderRecordModal(playerId, onTagClick) {
    state.editingId = playerId;
    document.getElementById('displayRound').innerText = state.currentRound;
    document.getElementById('recordTitleId').innerText = playerId;

    const locBox = document.getElementById('tab-loc');
    locBox.innerHTML = '';
    (mapData[state.selectedMap] || []).forEach(t => {
        createTagButton(t, locBox, '#e1f5fe', '#0277bd', onTagClick);
    });

    const actBox = document.getElementById('tab-act');
    actBox.innerHTML = '';
    state.activeTags.forEach(item => {
        const colors = tagColorMap[item.c] || { bg: '#f5f5f5', fg: '#616161' };
        createTagButton(item.t, actBox, colors.bg, colors.fg, onTagClick);
    });
}

function createTagButton(text, container, bg, fg, onClick) {
    const players = getCurrentPlayers();
    const hasIt = players[state.editingId - 1].tags.some(t => t.text === text);
    
    const btn = document.createElement('div');
    btn.className = `tag-btn ${hasIt ? 'active' : ''}`;
    btn.innerText = text;
    btn.style.cssText = hasIt 
        ? `background: ${bg}; color: ${fg}; border-color: ${fg}; filter: brightness(0.9); box-shadow: 0 0 5px ${bg}`
        : `border-left: 3px solid ${bg}`;
    
    btn.onclick = () => onClick(text, bg, fg);
    container.appendChild(btn);
}

export function switchTab(type) {
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('show'));
    
    const idx = type === 'loc' ? 0 : 1;
    document.querySelectorAll('.tab-item')[idx].classList.add('active');
    document.getElementById(`tab-${type}`).classList.add('show');
}