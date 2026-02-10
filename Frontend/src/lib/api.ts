const API_URL = "http://localhost:5000/api";

export const fetchLeaderboard = async () => {
    const res = await fetch(`${API_URL}/gamification/leaderboard`);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    return res.json();
};

export const updateProgress = async (userId: string, xpGained: number, badgesEarned: string[] = []) => {
    const res = await fetch(`${API_URL}/gamification/update-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, xpGained, badgesEarned }),
    });
    if (!res.ok) throw new Error("Failed to update progress");
    return res.json();
};
