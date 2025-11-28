import { useState, useEffect } from 'react';
import googleSheetsService from '../services/googleSheets';

const Stats = () => {
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const workouts = await googleSheetsService.getWorkouts();

            // Process data
            const processedData = processStats(workouts);
            setStatsData(processedData);
            setLoading(false);
        };

        fetchStats();
    }, []);

    const processStats = (workouts) => {
        // 1. Sort workouts by date (ascending) to calculate score
        const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));

        if (sortedWorkouts.length === 0) return [];

        // 2. Find date range (from first workout to today)
        const firstDate = new Date(sortedWorkouts[0].date);
        const today = new Date();
        // Reset time parts for accurate comparison
        firstDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const allDates = [];
        let currentDate = new Date(firstDate);

        while (currentDate <= today) {
            allDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 3. Calculate score and build rows
        let currentScore = 0;
        const rows = [];

        allDates.forEach(date => {
            const dateString = date.toLocaleDateString();
            // Find workout for this date (assuming date strings match locale)
            // Note: In a real app, we'd use a more robust date comparison library or ISO strings
            // Here we rely on the app using toLocaleDateString() consistently
            const workout = sortedWorkouts.find(w => w.date === dateString);

            let dailyScoreChange = 0;
            let isSkipped = false;

            if (workout) {
                // +5 for each completed exercise (checking if value > 0)
                // We check 'Completed' values. If they exist and are > 0, we count them.
                if (workout.barHangCompleted > 0) dailyScoreChange += 5;
                if (workout.plankCompleted > 0) dailyScoreChange += 5;
                if (workout.pushupsCompleted > 0) dailyScoreChange += 5;
            } else {
                dailyScoreChange = -10;
                isSkipped = true;
            }

            currentScore += dailyScoreChange;

            rows.push({
                date: dateString,
                workout: workout || null,
                score: currentScore,
                isSkipped
            });
        });

        // 4. Return last 30 days, descending
        return rows.reverse().slice(0, 30);
    };

    if (loading) {
        return <div className="stats-loading">Loading stats...</div>;
    }

    return (
        <div className="stats-container">
            <h2>30-Day Stats</h2>
            <div className="stats-table-wrapper">
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Bar Hang</th>
                            <th>Plank</th>
                            <th>Push-ups</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statsData.map((row, index) => (
                            <tr key={index} className={row.isSkipped ? 'skipped-row' : ''}>
                                <td>{row.date}</td>
                                {row.isSkipped ? (
                                    <td colSpan="3" className="skipped-cell">Skipped</td>
                                ) : (
                                    <>
                                        <td>{row.workout.barHangCompleted}s</td>
                                        <td>{row.workout.plankCompleted}s</td>
                                        <td>{row.workout.pushupsCompleted}</td>
                                    </>
                                )}
                                <td className="score-cell">{row.score}</td>
                            </tr>
                        ))}
                        {statsData.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No workouts recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stats;
