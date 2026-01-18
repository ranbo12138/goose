import { colorMap } from './config.js';
import { state, loadState, saveState, getCurrentPlayers, resetCurrentRound, resetAllRounds } from './state.js';
import { clearCache } from './storage.js';
import { 
    vibrate, renderGrid, updateModeBar, updateRoundButtons, updateControlButtons,
    openModal, closeModal, renderTagManager, renderRecordModal, switchTab
} from './ui.js';

function init() {
    loadState();
    document.getElementById('mapSelect').value = state.selectedMap;
    render();
    bindEvents();
}

function render() {
    renderGrid(handleCellClick);
    updateModeBar();
    updateRoundButtons();
    updateControlButtons();
}

function bindEvents() {
    // 地图选择
    document.getElementById('mapSelect').addEventListener('change', (e) => {
        state.selectedMap = e.target.value;
        saveState();
    });

    // 轮次切换
    document.querySelectorAll('.round-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            vibrate(10);
            state.currentRound = parseInt(btn.dataset.round);
            state.currentMode = 'normal';
            state.tempId = null;
            render();
            saveState();
        });
    });

    // 控制按钮
    ['report', 'vouch', 'knife', 'walk'].forEach(mode => {
        document.getElementById(`btn-${mode}`).addEventListener('click', () => {
            vibrate(20);
            if (state.currentMode === mode) {
                resetToNormal();
            } else {
                state.currentMode = mode;
                state.tempId = null;
                getCurrentPlayers().forEach(p => p.selected = false);
                render();
            }
        });
    });

    // 设置按钮
    document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));
    document.getElementById('tagMgrBtn').addEventListener('click', () => {
        closeModal();
        openModal('tagMgrModal');
        renderTagManager();
    });

    // 标签管理
    document.getElementById('addTagBtn').addEventListener('click', () => {
        const name = document.getElementById('newTagName').value.trim();
        const color = document.getElementById('newTagColor').value;
        if (name) {
            state.activeTags.push({t: name, c: color});
            document.getElementById('newTagName').value = '';
            saveState();
            renderTagManager();
        }
    });

    document.getElementById('customTagList').addEventListener('click', (e) => {
        if (e.target.classList.contains('del-btn')) {
            if (confirm('删除此标签？')) {
                const idx = parseInt(e.target.dataset.index);
                state.activeTags.splice(idx, 1);
                saveState();
                renderTagManager();
            }
        }
    });

    // 设置操作
    document.getElementById('resetRoundBtn').addEventListener('click', () => {
        vibrate(30);
        if (confirm(`确定清空【第 ${state.currentRound} 轮】记录吗？`)) {
            resetCurrentRound();
            resetToNormal();
            closeModal();
        }
    });

    document.getElementById('newGameBtn').addEventListener('click', () => {
        vibrate(50);
        if (confirm('⚠️ 开启新局？(清空所有轮次数据, 保留标签设置)')) {
            resetAllRounds();
            resetToNormal();
            closeModal();
        }
    });

    document.getElementById('clearCacheBtn').addEventListener('click', () => {
        if (confirm('🧹 强制清除所有缓存？(包括自定义标签)')) {
            clearCache();
            location.reload();
        }
    });

    // 记录弹窗标签页切换
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            vibrate(5);
            switchTab(tab.dataset.tab);
        });
    });

    // 点击遮罩关闭弹窗
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });
}

function handleCellClick(id) {
    vibrate(10);
    
    if (state.currentMode === 'normal') {
        renderRecordModal(id, handleTagClick);
        openModal('recordModal');
        return;
    }

    if (state.currentMode === 'knife') {
        const p = getCurrentPlayers()[id - 1];
        p.hasKnife = !p.hasKnife;
        saveState();
        render();
        resetToNormal();
        return;
    }

    if (state.currentMode === 'report') {
        if (!state.tempId) {
            state.tempId = id;
            getCurrentPlayers()[id - 1].selected = true;
            render();
        } else {
            if (id === state.tempId) return alert('不能自踩');
            const cB = colorMap[id - 1];
            const cA = colorMap[state.tempId - 1];
            toggleTag(state.tempId, `🦶踩${id}`, cB.bg, cB.fg);
            toggleTag(id, `被${state.tempId}🦶`, cA.bg, cA.fg);
            resetToNormal();
        }
        return;
    }

    if (state.currentMode === 'vouch') {
        if (!state.tempId) {
            state.tempId = id;
            getCurrentPlayers()[id - 1].selected = true;
            render();
        } else {
            if (id === state.tempId) { resetToNormal(); return; }
            const cTarget = colorMap[id - 1];
            const cActor = colorMap[state.tempId - 1];
            toggleTag(state.tempId, `保${id}`, cTarget.bg, cTarget.fg);
            toggleTag(id, `被${state.tempId}保`, cActor.bg, cActor.fg);
            resetToNormal();
        }
        return;
    }

    if (state.currentMode === 'walk') {
        if (!state.tempId) {
            state.tempId = id;
            getCurrentPlayers()[id - 1].selected = true;
            render();
        } else {
            if (id === state.tempId) { resetToNormal(); return; }
            const cTarget = colorMap[id - 1];
            const cActor = colorMap[state.tempId - 1];
            toggleTag(state.tempId, `一起走👫${id}`, cTarget.bg, cTarget.fg);
            toggleTag(id, `一起走👫${state.tempId}`, cActor.bg, cActor.fg);
            resetToNormal();
        }
        return;
    }
}

function handleTagClick(text, bg, fg) {
    vibrate(5);
    toggleTag(state.editingId, text, bg, fg);
    renderRecordModal(state.editingId, handleTagClick);
    render();
}

function toggleTag(id, text, bg, fg) {
    const p = getCurrentPlayers()[id - 1];
    const idx = p.tags.findIndex(t => t.text === text);
    if (idx >= 0) {
        p.tags.splice(idx, 1);
    } else {
        p.tags.push({text, bg, fg});
    }
    saveState();
}

function resetToNormal() {
    state.currentMode = 'normal';
    state.tempId = null;
    getCurrentPlayers().forEach(p => p.selected = false);
    render();
}

init();