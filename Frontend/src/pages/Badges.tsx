import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { BackgroundParticles } from "@/components/Dashboard/BackgroundParticles";
import { ArrowLeft, Award, Lock, Star, Code2, Zap, Shield, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Badge Data Definition
interface Badge {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    condition: (stats: any) => boolean;
    color: string;
}

// Helper for Icon
const AlertTriangleIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
);

const BADGES: Badge[] = [
    {
        id: "first_code",
        title: "First Code Run",
        description: "Successfully ran your first Java program.",
        icon: <Code2 size={32} />,
        condition: () => true, // Auto-unlock for demo
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "streak_master",
        title: "Streak Master",
        description: "Maintained a 3-day login streak.",
        icon: <Zap size={32} />,
        condition: (stats) => stats.streak >= 3,
        color: "from-yellow-400 to-orange-500"
    },
    {
        id: "bug_hunter",
        title: "Bug Hunter",
        description: "Completed 5 Daily Bug Hunts.",
        icon: <Shield size={32} />,
        condition: (stats) => stats.bugHunts >= 5,
        color: "from-green-500 to-emerald-500"
    },
    {
        id: "stream_master",
        title: "Stream Master",
        description: "Completed the Java Streams module.",
        icon: <Award size={32} />,
        condition: (stats) => stats.modules?.includes("streams"),
        color: "from-purple-500 to-violet-500"
    },
    {
        id: "exception_slayer",
        title: "Exception Slayer",
        description: "Solved 10 Error Handling challenges.",
        icon: <AlertTriangleIcon size={32} />,
        condition: (stats) => stats.exceptionsSolved >= 10,
        color: "from-red-500 to-pink-500"
    },
    {
        id: "java_champion",
        title: "Java Champion",
        description: "Reached Level 10 and mastered the basics.",
        icon: <Crown size={32} />,
        condition: (stats) => stats.level >= 10,
        color: "from-amber-300 to-yellow-600"
    }
];




export const Badges = () => {
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        // Mock loading stats from localStorage
        const currentStats = {
            streak: parseInt(localStorage.getItem("streak") || "0"),
            level: parseInt(localStorage.getItem("level") || "1"),
            bugHunts: parseInt(localStorage.getItem("bugHuntsCompleted") || "0"),
            modules: JSON.parse(localStorage.getItem("completedModules") || "[]"),
            exceptionsSolved: parseInt(localStorage.getItem("exceptionsSolved") || "0")
        };
        setStats(currentStats);

        // Check unlocks
        const unlocked = BADGES.filter(badge => badge.condition(currentStats)).map(b => b.id);
        setUnlockedBadges(unlocked);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative overflow-hidden">
            <BackgroundParticles />
            <Header fluid={true} />

            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
                            <ArrowLeft size={20} /> Back to Kingdom
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 font-pixel drop-shadow-sm">
                            Hall of Fame
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Showcasing your legendary achievements.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex items-center gap-6 shadow-xl">
                        <div className="text-right">
                            <span className="block text-sm text-slate-400 uppercase tracking-widest font-bold">Total Unlocked</span>
                            <span className="text-4xl font-black text-white">{unlockedBadges.length} <span className="text-slate-500 text-2xl">/ {BADGES.length}</span></span>
                        </div>
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center border-2 border-yellow-500/50">
                            <TrophyIcon size={32} className="text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BADGES.map((badge) => {
                        const isUnlocked = unlockedBadges.includes(badge.id);

                        return (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={isUnlocked ? { scale: 1.03, y: -5 } : {}}
                                className={`relative p-8 rounded-3xl border transition-all duration-300 overflow-hidden group
                    ${isUnlocked
                                        ? "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:shadow-2xl hover:shadow-purple-500/10"
                                        : "bg-slate-900/40 border-slate-800 opacity-60 grayscale"}
                `}
                            >
                                {/* Background Glow for Unlocked */}
                                {isUnlocked && (
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${badge.color} opacity-10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
                                )}

                                <div className="relative z-10 flex items-start gap-6">
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-12
                        ${isUnlocked ? `bg-gradient-to-br ${badge.color} text-white` : "bg-slate-800 text-slate-600"}
                    `}>
                                        {isUnlocked ? badge.icon : <Lock size={32} />}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                            {badge.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {badge.description}
                                        </p>

                                        {isUnlocked && (
                                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
                                                <Award size={14} /> Unlocked
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

const TrophyIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
);
