/**
 * Calculates the current streak of consecutive days with workouts.
 * @param {Array} workouts - List of workout objects, each having a 'date' property.
 * @returns {number} The current streak count.
 */
export const calculateStreak = (workouts) => {
    if (!workouts || workouts.length === 0) return 0;

    // 1. Sort workouts by date (descending)
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Get unique dates (normalize to midnight to avoid time issues)
    const uniqueDates = new Set();
    sortedWorkouts.forEach(w => {
        const d = new Date(w.date);
        d.setHours(0, 0, 0, 0);
        uniqueDates.add(d.getTime());
    });

    const sortedUniqueDates = Array.from(uniqueDates).sort((a, b) => b - a);

    if (sortedUniqueDates.length === 0) return 0;

    // 3. Check if the most recent workout is Today or Yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    const lastWorkoutTime = sortedUniqueDates[0];

    // If the last workout was before yesterday, the streak is broken (0)
    if (lastWorkoutTime < yesterdayTime) {
        return 0;
    }

    // 4. Count consecutive days backwards
    let streak = 1;
    let currentDate = new Date(lastWorkoutTime);

    for (let i = 1; i < sortedUniqueDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1); // Expected previous day

        // Check if the next date in our list matches the expected previous day
        if (sortedUniqueDates[i] === prevDate.getTime()) {
            streak++;
            currentDate = prevDate;
        } else {
            break; // Gap found, streak ends
        }
    }

    return streak;
};
