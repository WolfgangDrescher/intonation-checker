import { Deferred } from '../utils/deferred.js';

export function useScoreStore() {
    const isReady = new Deferred();
    return {
        isReady,
    };
}
