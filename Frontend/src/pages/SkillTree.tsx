import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { BackgroundParticles } from "@/components/Dashboard/BackgroundParticles";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sprout, Flower2, Lock, Droplets, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Mock Data for Skills
const SKILLS = [
    { id: "basics", title: "Java Basics", status: "completed", level: 1, pos: { x: 50, y: 80 } },
    { id: "oop", title: "OOP Concepts", status: "completed", level: 2, pos: { x: 30, y: 65 } },
    { id: "collections", title: "Collections", status: "in-progress", level: 3, pos: { x: 70, y: 55 } },
    { id: "multithreading", title: "Multithreading", status: "locked", level: 4, pos: { x: 40, y: 40 } },
    { id: "streams", title: "Streams API", status: "locked", level: 5, pos: { x: 60, y: 30 } },
    { id: "spring", title: "Spring Boot", status: "locked", level: 6, pos: { x: 50, y: 15 } },
];

export const SkillTree = () => {
    const [growth, setGrowth] = useState(0);
    const [dragonsBreath, setDragonsBreath] = useState(false); // Easter egg state? No, sticking to water for now.

    useEffect(() => {
        // Animate growth on mount
        const completedCount = SKILLS.filter(s => s.status === "completed").length;
        const progress = (completedCount / SKILLS.length) * 100;
        setTimeout(() => setGrowth(progress), 500);
    }, []);

    const handleWaterPlant = () => {
        toast.success("You watered the plant!", {
            description: "Keep learning to see it grow differently.",
            icon: "💧"
        });
        // Temporary visual shake/growth effect
        setGrowth(prev => Math.min(prev + 5, 100)); // Cap at 100
    };

    return (
        <div className="min-h-screen bg-emerald-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden transition-colors duration-500">
            <BackgroundParticles />
            <Header fluid={true} />

            <main className="relative z-10 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">

                {/* Header HUD */}
                <div className="absolute top-4 left-6 md:left-20 right-6 md:right-20 flex justify-between items-start z-20 pointer-events-none">
                    <div>
                        <Link to="/" className="pointer-events-auto flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-2 hover:underline">
                            <ArrowLeft size={20} /> Back to Kingdom
                        </Link>
                        <h1 className="text-4xl font-black text-emerald-900 dark:text-white drop-shadow-sm font-pixel">
                            Skill Garden
                        </h1>
                        <p className="text-emerald-600 dark:text-slate-400 text-lg">
                            Growth: {Math.round(growth)}%
                        </p>
                    </div>

                    <Button
                        onClick={handleWaterPlant}
                        className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 h-auto shadow-lg hover:rotate-12 transition-transform"
                    >
                        <Droplets size={28} className="fill-current" />
                    </Button>
                </div>

                {/* The Pot and Plant Container */}
                <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-[4/3] flex items-end justify-center">

                    {/* Pot */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-0 w-48 md:w-64 z-20"
                    >
                        {/* Simple Pot SVG */}
                        <svg viewBox="0 0 100 80" className="w-full drop-shadow-2xl">
                            <path d="M10,0 L90,0 L80,80 L20,80 Z" fill="url(#potGradient)" />
                            <defs>
                                <linearGradient id="potGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#d97706" />
                                    <stop offset="50%" stopColor="#b45309" />
                                    <stop offset="100%" stopColor="#78350f" />
                                </linearGradient>
                            </defs>
                            <rect x="5" y="0" width="90" height="15" fill="#f59e0b" rx="2" />
                        </svg>
                        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-900/50 rounded-[100%] blur-sm pointer-events-none"></div>
                    </motion.div>

                    {/* Plant Stem (SVG) */}
                    <svg className="absolute bottom-16 md:bottom-20 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
                        {/* Main Stem - Animated Growth */}
                        <motion.path
                            d="M50,100 Q50,70 50,50 Q50,30 50,10"
                            fill="none"
                            stroke="#10b981" // emerald-500
                            strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: growth / 100 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />

                        {/* Dynamic Branches based on skills */}
                        {SKILLS.map((skill, index) => {
                            // Only show branch if growth reaches its level threshold approx
                            const threshold = (index + 1) * 15;
                            const isVisible = growth >= threshold;
                            const isLeft = index % 2 !== 0;
                            const startY = 100 - (index + 1) * 13; // Roughly evenly spaced

                            // Visual offset for branch
                            const endX = isLeft ? 30 : 70;
                            const endY = startY - 10;

                            return (
                                <motion.g key={skill.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }} transition={{ delay: index * 0.3 }}>
                                    {/* Branch Stem */}
                                    <path d={`M50,${startY} Q${isLeft ? 40 : 60},${startY - 5} ${endX},${endY}`} fill="none" stroke="#059669" strokeWidth="1.5" />
                                </motion.g>
                            );
                        })}
                    </svg>

                    {/* Skill Nodes (Interactive) */}
                    <div className="absolute inset-0 z-30">
                        {SKILLS.map((skill, index) => {
                            // Similar coordinate logic to SVG to align overlays (simplified for relative positioning)
                            // Note: SVG logic above was declarative, here we use absolute percentage positioning for the HTML elements
                            const isLeft = index % 2 !== 0;
                            const bottomPos = (index + 1) * 13 + 18; // Match SVG Roughly + Pot Offset
                            const leftPos = isLeft ? "30%" : "70%";

                            // Don't show if not grown enough yet
                            const threshold = (index + 1) * 15;
                            if (growth < threshold) return null;

                            return (
                                <motion.div
                                    key={skill.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                        ${skill.status === 'locked' ? 'grayscale opacity-70' : ''}
                    `}
                                    style={{ left: leftPos, bottom: `${bottomPos}%` }}
                                    onClick={() => toast.info(`${skill.title}: ${skill.status.replace('-', ' ')}`, { description: "Complete challenges to master this skill!" })}
                                >
                                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all
                        ${skill.status === 'completed' ? 'bg-pink-100 border-pink-500' :
                                            skill.status === 'in-progress' ? 'bg-emerald-100 border-emerald-500' :
                                                'bg-slate-200 border-slate-400'}
                    `}>
                                        {skill.status === 'completed' ? (
                                            <Flower2 size={32} className="text-pink-500 animate-pulse-slow" />
                                        ) : skill.status === 'in-progress' ? (
                                            <Sprout size={32} className="text-emerald-600" />
                                        ) : (
                                            <Lock size={24} className="text-slate-500" />
                                        )}

                                        {/* Status Badge */}
                                        {skill.status === 'completed' && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full text-[10px] shadow-sm">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-3 py-1 rounded-full text-sm font-bold shadow-md
                         ${skill.status === 'completed' ? 'bg-pink-500 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300'}
                    `}>
                                        {skill.title}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>

            </main>
        </div>
    );
};
