const STORAGE_KEY = 'goose_duck_v30_modular';

export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearCache() {
    localStorage.removeItem(STORAGE_KEY);
}