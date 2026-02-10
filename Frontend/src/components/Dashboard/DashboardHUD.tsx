import { motion } from "framer-motion";
import { Trophy, Star, Zap, Flame } from "lucide-react";
import { useEffect, useState } from "react";

export const DashboardHUD = () => {
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const storedXp = Number(localStorage.getItem("xp") || "0");
        const storedStreak = Number(localStorage.getItem("streak") || "0");

        setXp(storedXp);
        setStreak(storedStreak);
        setLevel(Math.floor(storedXp / 1000) + 1);
    }, []);

    const progressToNextLevel = (xp % 1000) / 10; // Percentage

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full mb-12"
        >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden transition-colors duration-500">

                {/* Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                {/* User Info */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[3px] shadow-lg">
                            <img
                                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player`}
                                alt="Avatar"
                                className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black font-black text-sm w-8 h-8 flex items-center justify-center rounded-full border-4 border-white dark:border-slate-900 shadow-md">
                            {level}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-slate-900 dark:text-white font-black text-3xl tracking-tight mb-1">Coding Hero</h2>
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-300 font-bold text-lg">
                            <Trophy size={18} />
                            <span>Rank: Novice</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex flex-1 gap-12 justify-center w-full md:w-auto">
                    <div className="text-center group">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-center gap-2 uppercase tracking-wide"><Zap size={16} className="text-yellow-500 dark:text-yellow-400 group-hover:scale-110 transition-transform" /> XP</p>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{xp}</div>
                    </div>
                    <div className="text-center relative group px-4">
                        <div className="absolute -inset-4 bg-orange-500/10 rounded-2xl blur-md group-hover:bg-orange-500/20 transition-colors opacity-0 group-hover:opacity-100"></div>
                        <div className="relative">
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center justify-center gap-2 uppercase tracking-wide"><Flame size={20} className="text-orange-500 fill-orange-500 animate-pulse" /> Streak</p>
                            <div className="text-5xl font-black text-slate-900 dark:text-white drop-shadow-sm">{streak}</div>
                        </div>
                    </div>
                    <div className="text-center group">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-center gap-2 uppercase tracking-wide"><Star size={16} className="text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" /> Badges</p>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{Math.floor(xp / 500)}</div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                {/* XP Progress Bar */}
                <div className="w-full md:w-80">
                    <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">
                        <span>Level {level}</span>
                        <span>{Math.round(progressToNextLevel)}% to Lvl {level + 1}</span>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNextLevel}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                        />
                    </div>
                </div>

            </div>
        </motion.div>
    );
};
