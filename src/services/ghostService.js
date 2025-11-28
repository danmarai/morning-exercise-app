/**
 * Calculates personal bests from workout history.
 * @param {Array} workouts 
 * @returns {object} { barHang: number, plank: number, pushups: number }
 */
export const getPersonalBests = (workouts) => {
    if (!workouts || workouts.length === 0) {
        return { barHang: 0, plank: 0, pushups: 0 };
    }

    const bests = {
        barHang: 0,
        plank: 0,
        pushups: 0
    };

    workouts.forEach(w => {
        // Check Bar Hang (completed duration)
        const barHang = parseInt(w.barHangCompleted) || 0;
        if (barHang > bests.barHang) bests.barHang = barHang;

        // Check Plank (completed duration)
        const plank = parseInt(w.plankCompleted) || 0;
        if (plank > bests.plank) bests.plank = plank;

        // Check Push-ups (completed count)
        const pushups = parseInt(w.pushupsCompleted) || 0;
        if (pushups > bests.pushups) bests.pushups = pushups;
    });

    return bests;
};
