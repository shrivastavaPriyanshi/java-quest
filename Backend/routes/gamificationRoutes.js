import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Update User Progress (XP, Level, Badges)
router.post("/update-progress", async (req, res) => {
    const { userId, xpGained, badgesEarned } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.xp += xpGained;
        user.totalSolved += 1;

        // Level up logic: Level = 1 + floor(XP / 1000)
        const newLevel = 1 + Math.floor(user.xp / 1000);
        if (newLevel > user.level) {
            user.level = newLevel;
        }

        if (badgesEarned && badgesEarned.length > 0) {
            // Add unique badges only
            badgesEarned.forEach(badge => {
                if (!user.badges.includes(badge)) {
                    user.badges.push(badge);
                }
            });
        }

        await user.save();
        res.json({ message: "Progress updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get Global Leaderboard
router.get("/leaderboard", async (req, res) => {
    try {
        // Top 10 users sorted by XP descending
        const leaderboard = await User.find({}, "name xp level badges")
            .sort({ xp: -1 })
            .limit(10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
