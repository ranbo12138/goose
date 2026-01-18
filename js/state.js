import { defaultActTags } from './config.js';
import { saveData, loadData } from './storage.js';

export const state = {
    currentRound: 1,
    currentMode: 'normal',
    tempId: null,
    editingId: null,
    roundsData: {},
    activeTags: [],
    selectedMap: 'base',
    playerCount: 15  // 新增
};

export function initPlayers() {
    return Array.from({length: 15}, (_, i) => ({ 
        id: i + 1, 
        selected: false, 
        hasKnife: false, 
        tags: [] 
    }));
}

export function initState() {
    state.roundsData = {
        1: initPlayers(), 2: initPlayers(), 3: initPlayers(), 
        4: initPlayers(), 5: initPlayers()
    };
    state.activeTags = [...defaultActTags];
    state.playerCount = 15;
}

export function loadState() {
    const data = loadData();
    if (data) {
        state.roundsData = data.rounds;
        state.currentRound = data.curRound;
        state.selectedMap = data.map || 'base';
        state.activeTags = data.activeTags?.length > 0 ? data.activeTags : [...defaultActTags];
        state.playerCount = data.playerCount || 15;  // 新增
    } else {
        initState();
    }
}

export function saveState() {
    saveData({
        rounds: state.roundsData,
        curRound: state.currentRound,
        map: state.selectedMap,
        activeTags: state.activeTags,
        playerCount: state.playerCount  // 新增
    });
}

export function getCurrentPlayers() {
    return state.roundsData[state.currentRound];
}

export function resetCurrentRound() {
    state.roundsData[state.currentRound] = initPlayers();
    saveState();
}

export function resetAllRounds() {
    state.roundsData = {
        1: initPlayers(), 2: initPlayers(), 3: initPlayers(), 
        4: initPlayers(), 5: initPlayers()
    };
    state.currentRound = 1;
    saveState();
}