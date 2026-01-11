/**
 * Simple Event Emitter for Authentication Events
 * Used to decouple API utility from Auth Context
 */
const authEvents = {
    listeners: [],

    subscribeLogout(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    },

    emitLogout() {
        this.listeners.forEach(callback => callback());
    }
};

export default authEvents;
