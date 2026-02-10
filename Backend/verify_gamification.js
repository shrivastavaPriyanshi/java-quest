
const API_URL = "http://localhost:5000/api";

const testGamification = async () => {
    try {
        // 1. Register a test user
        const email = `testuser_${Date.now()}@example.com`;
        const password = "password123";

        console.log("Registering user...");
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test Gamer", email, password })
        });
        const registerData = await registerRes.json();
        console.log("Register:", registerData);

        // 2. Login to get userId
        console.log("Logging in...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        console.log("Login:", loginData);
        const userId = loginData.userId;

        if (!userId) {
            console.error("❌ Failed to get userId from login");
            return;
        }

        // 3. Update Progress
        console.log("Updating progress...");
        const progressRes = await fetch(`${API_URL}/gamification/update-progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, xpGained: 150, badgesEarned: ["First Win"] })
        });
        const progressData = await progressRes.json();
        console.log("Progress Update:", progressData);

        // 4. Check Leaderboard
        console.log("Fetching leaderboard...");
        const lbRes = await fetch(`${API_URL}/gamification/leaderboard`);
        const lbData = await lbRes.json();
        console.log("Leaderboard:", lbData);

        const userInLb = lbData.find(u => u._id === userId);
        if (userInLb && userInLb.xp === 150) {
            console.log("✅ Verification SUCCESS: User found in leaderboard with correct XP!");
        } else {
            console.error("❌ Verification FAILED: User not found or XP mismatch");
        }

    } catch (err) {
        console.error("Test failed:", err);
    }
};

testGamification();
