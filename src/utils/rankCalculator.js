export const RANKS = [
    { title: 'Novice', threshold: 0, color: '#A0A0A0' },      // Grey
    { title: 'Apprentice', threshold: 10, color: '#4CAF50' }, // Green
    { title: 'Warrior', threshold: 25, color: '#2196F3' },    // Blue
    { title: 'Elite', threshold: 50, color: '#9C27B0' },      // Purple
    { title: 'Legend', threshold: 100, color: '#FFD700' }     // Gold
];

/**
 * Calculates the user's rank based on total completed workouts.
 * @param {number} totalWorkouts 
 * @returns {object} { currentRank, nextRank, progress, workoutsToNext }
 */
export const calculateRank = (totalWorkouts) => {
    let currentRank = RANKS[0];
    let nextRank = RANKS[1];

    for (let i = 0; i < RANKS.length; i++) {
        if (totalWorkouts >= RANKS[i].threshold) {
            currentRank = RANKS[i];
            nextRank = RANKS[i + 1] || null;
        } else {
            break;
        }
    }

    let progress = 0;
    let workoutsToNext = 0;

    if (nextRank) {
        const range = nextRank.threshold - currentRank.threshold;
        const currentInRank = totalWorkouts - currentRank.threshold;
        progress = Math.min(100, Math.floor((currentInRank / range) * 100));
        workoutsToNext = nextRank.threshold - totalWorkouts;
    } else {
        progress = 100; // Max rank achieved
    }

    return {
        currentRank,
        nextRank,
        progress,
        workoutsToNext
    };
};
