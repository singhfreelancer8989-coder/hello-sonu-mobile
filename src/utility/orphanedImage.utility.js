
import secureStorage from './secureStorage.utility';

const ORPHANED_KEY = 'pending_orphaned_images';

export const addOrphanedKey = async (key) => {
    if (!key) return;
    try {
        const stored = await secureStorage.getData(ORPHANED_KEY);
        const keys = stored ? JSON.parse(stored) : [];
        if (!keys.includes(key)) {
            keys.push(key);
            console.log("[OrphanedUtility] Tracking key:", key);
            await secureStorage.storeData(ORPHANED_KEY, JSON.stringify(keys));
        }
    } catch (e) {
        // console.error("Failed to track orphaned key", e);
    }
};

export const removeOrphanedKey = async (key) => {
    if (!key) return;
    try {
        const stored = await secureStorage.getData(ORPHANED_KEY);
        let keys = stored ? JSON.parse(stored) : [];
        const initialLen = keys.length;
        keys = keys.filter(k => k !== key);
        if (keys.length !== initialLen) {
            console.log("[OrphanedUtility] Removed tracked key:", key);
            await secureStorage.storeData(ORPHANED_KEY, JSON.stringify(keys));
        }
    } catch (e) {
        // console.error("Failed to remove orphaned key", e);
    }
};

export const getAndClearOrphanedKeys = async () => {
    try {
        const stored = await secureStorage.getData(ORPHANED_KEY);
        const keys = stored ? JSON.parse(stored) : [];
        if (keys.length > 0) {
            console.log("[OrphanedUtility] Found orphaned keys from previous session:", keys.length);
            await secureStorage.removeData(ORPHANED_KEY);
            return keys;
        }
        return [];
    } catch (e) {
        // console.error("Failed to get orphaned keys", e);
        return [];
    }
};
