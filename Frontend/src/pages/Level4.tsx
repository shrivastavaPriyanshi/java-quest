import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { useNavigate } from "react-router-dom";
import { updateProgress } from "@/lib/api";
import { Heart, Zap, Shield, Skull } from "lucide-react";

// 👾 Boss & Player Stats
const MAX_PLAYER_HP = 100;
const MAX_BOSS_HP = 100;
const BOSS_DAMAGE = 25;
const PLAYER_DAMAGE = 34; // 3 hits to kill

// ⚔️ Battle Questions
const battleQuestions = [
    {
        id: 1,
        text: "The Boss casts 'NullPointerException'! Quick, catch it!",
        code: "try {\n  String s = null;\n  s.length();\n} ______ (NullPointerException e) {\n  System.out.println(\"caught!\");\n}",
        options: ["catch", "except", "handle", "throw"],
        answer: "catch",
    },
    {
        id: 2,
        text: "The Boss is looping infinitely! Break the loop!",
        code: "while (true) {\n  if (health < 10) ______;\n}",
        options: ["stop", "exit", "break", "return"],
        answer: "break",
    },
    {
        id: 3,
        text: "The Boss is hiding in a private method! Access it!",
        code: "______ void secretAttack() {\n  // deadly attack\n}",
        options: ["public", "static", "private", "protected"],
        answer: "private",
    },
    {
        id: 4,
        text: "Declare a constant shield to block the attack!",
        code: "______ final int SHIELD_STRENGTH = 100;",
        options: ["var", "static", "const", "int"],
        answer: "static",
    },
];

export default function Level4() {
    const navigate = useNavigate();

    // 🎮 Game State
    const [started, setStarted] = useState(false);
    const [turn, setTurn] = useState<"player" | "boss" | "win" | "lose">("player");
    const [currentQ, setCurrentQ] = useState(0);
    const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
    const [bossHp, setBossHp] = useState(MAX_BOSS_HP);
    const [feedback, setFeedback] = useState("");
    const [shake, setShake] = useState(false); // Screen shake effect
    const [attackAnim, setAttackAnim] = useState<"none" | "player" | "boss">("none");

    // 🎵 Effects (Visual only for now)
    const playHitEffect = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleAnswer = (option: string) => {
        if (turn !== "player") return;

        const correct = option === battleQuestions[currentQ].answer;

        if (correct) {
            // ⚔️ Player Attacks
            setFeedback("✨ EXCELLENT! Spell Cast!");
            setAttackAnim("player");

            setTimeout(() => {
                setBossHp((prev) => Math.max(0, prev - PLAYER_DAMAGE));
                playHitEffect();
                setAttackAnim("none");

                if (bossHp - PLAYER_DAMAGE <= 0) {
                    handleWin();
                } else {
                    setCurrentQ((p) => (p + 1) % battleQuestions.length);
                    setTurn("boss");
                }
            }, 1000);

        } else {
            // 🛡️ Attack Missed / Blocked
            setFeedback("❌ Syntax Error! The spell fizzled...");
            setTurn("boss");
        }
    };

    // 🤖 Boss Turn Logic
    useEffect(() => {
        if (turn === "boss") {
            setFeedback("⚠️ The Boss is charging an attack...");

            setTimeout(() => {
                setAttackAnim("boss");
                setTimeout(() => {
                    setPlayerHp((prev) => Math.max(0, prev - BOSS_DAMAGE));
                    playHitEffect();
                    setAttackAnim("none");

                    if (playerHp - BOSS_DAMAGE <= 0) {
                        setTurn("lose");
                    } else {
                        setFeedback("你的 ⚡ Turn! Cast a spell!");
                        setTurn("player");
                    }
                }, 800);
            }, 2000);
        }
    }, [turn, playerHp]);

    const handleWin = () => {
        setTurn("win");
        localStorage.setItem("level4Completed", "true");

        // Sync with backend
        const userId = localStorage.getItem("userId");
        if (userId) {
            updateProgress(userId, 300, ["Boss Slayer"]) // Big reward for Boss
                .catch(err => console.error(err));
        }
    };

    return (
        <div className={`min-h-screen relative overflow-hidden bg-slate-900 text-white ${shake ? "animate-shake" : ""}`}>
            <Header />

            {/* 🌫️ Background Fog */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" />

            <main className="container py-8 relative z-10 flex flex-col items-center">

                {/* ===================== INTRO SCREEN ===================== */}
                {!started && (
                    <div className="text-center mt-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-9xl mb-6"
                        >
                            👾
                        </motion.div>
                        <h1 className="text-5xl font-extrabold text-red-500 mb-4 font-pixel tracking-widest">
                            BOSS BATTLE
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 max-w-lg mx-auto">
                            A wild <strong>SYNTAX ERROR</strong> appeared!<br />
                            It blocks your path with confusing bugs.<br />
                            Use your <strong>Java Knowledge</strong> to debug it!
                        </p>
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-xl px-10 py-8 font-bold animate-bounce"
                            onClick={() => setStarted(true)}
                        >
                            ⚔️ FIGHT!
                        </Button>
                    </div>
                )}

                {/* ===================== BATTLE ARENA ===================== */}
                {started && turn !== "win" && turn !== "lose" && (
                    <div className="w-full max-w-4xl">

                        {/* 🏥 Health Bars */}
                        <div className="flex justify-between items-end mb-12 px-4">

                            {/* Player Stats */}
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-4xl">🧙‍♂️</span>
                                    <span className="font-bold text-xl text-blue-300">Hero</span>
                                </div>
                                <div className="w-64 h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-500">
                                    <motion.div
                                        className="h-full bg-green-500"
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(playerHp / MAX_PLAYER_HP) * 100}%` }}
                                        transition={{ type: "spring" }}
                                    />
                                </div>
                                <div className="text-sm mt-1 text-slate-400">{playerHp} / {MAX_PLAYER_HP} HP</div>
                            </div>

                            {/* VS Badge */}
                            <div className="text-3xl font-black text-slate-600 italic">VS</div>

                            {/* Boss Stats */}
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-2">
                                    <span className="font-bold text-xl text-red-400">Syntax Error</span>
                                    <span className={`text-6xl inline-block ${attackAnim === "boss" ? "animate-lung" : "animate-float"}`}>
                                        👾
                                    </span>
                                </div>
                                <div className="w-64 h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-500">
                                    <motion.div
                                        className="h-full bg-red-600"
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(bossHp / MAX_BOSS_HP) * 100}%` }}
                                        transition={{ type: "spring" }}
                                    />
                                </div>
                                <div className="text-sm mt-1 text-slate-400">{bossHp} / {MAX_BOSS_HP} HP</div>
                            </div>
                        </div>

                        {/* 🌩️ Attack Animations (Overlay) */}
                        <AnimatePresence>
                            {attackAnim === "player" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, x: -200 }}
                                    animate={{ opacity: 1, scale: 1.5, x: 200 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-1/3 left-1/3 text-6xl z-50 pointer-events-none"
                                >
                                    ⚡⚡⚡
                                </motion.div>
                            )}
                            {attackAnim === "boss" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, x: 200 }}
                                    animate={{ opacity: 1, scale: 1.5, x: -200 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-1/3 right-1/3 text-6xl z-50 pointer-events-none"
                                >
                                    🔥bug🔥
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* 📜 Code Casting Console */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-slate-800/90 border border-slate-600 p-8 rounded-xl shadow-2xl backdrop-blur-md"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-mono text-yellow-400">
                                    <Zap className="inline w-5 h-5 mr-2" />
                                    Cast Spells
                                </h3>
                                <span className="bg-slate-900 px-3 py-1 rounded text-sm text-slate-400 font-mono">
                                    Turn: {turn === "player" ? "YOU" : "BOSS"}
                                </span>
                            </div>

                            <div className="bg-black p-4 rounded-lg font-mono text-green-400 mb-6 text-lg whitespace-pre-wrap border border-slate-700">
                                {battleQuestions[currentQ].code}
                            </div>

                            <p className="mb-4 text-slate-300 italic">{battleQuestions[currentQ].text}</p>

                            <div className="grid grid-cols-2 gap-4">
                                {battleQuestions[currentQ].options.map(opt => (
                                    <Button
                                        key={opt}
                                        disabled={turn !== "player"}
                                        onClick={() => handleAnswer(opt)}
                                        variant="secondary"
                                        className="h-14 text-lg hover:bg-yellow-500 hover:text-black transition-colors"
                                    >
                                        {opt}
                                    </Button>
                                ))}
                            </div>

                            {feedback && (
                                <motion.div
                                    animate={{ scale: [0.9, 1.1, 1] }}
                                    className="mt-4 text-center font-bold text-lg"
                                >
                                    {feedback}
                                </motion.div>
                            )}

                        </motion.div>
                    </div>
                )}

                {/* ===================== WIN / LOSE SCREENS ===================== */}
                {turn === "win" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center mt-20"
                    >
                        <div className="text-8xl mb-4">🏆</div>
                        <h2 className="text-6xl font-bold text-yellow-400 mb-4 font-pixel">VICTORY!</h2>
                        <p className="text-2xl text-slate-200 mb-8">The Syntax Monster has been debugged!</p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => navigate("/map")} className="bg-green-600 text-lg px-8 py-6">
                                Return to Map
                            </Button>
                            <Button onClick={() => navigate("/leaderboard")} variant="outline" className="text-lg px-8 py-6">
                                Check Leaderboard
                            </Button>
                        </div>
                    </motion.div>
                )}

                {turn === "lose" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center mt-20"
                    >
                        <div className="text-8xl mb-4">💀</div>
                        <h2 className="text-6xl font-bold text-red-600 mb-4 font-pixel">GAME OVER</h2>
                        <p className="text-2xl text-slate-200 mb-8">Your code didn't compile...</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-white text-black hover:bg-slate-200 text-lg px-8 py-6"
                        >
                            Try Again
                        </Button>
                    </motion.div>
                )}

            </main>

            {/* Global CSS for Animations */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .font-pixel {
          font-family: 'Courier New', monospace; /* Fallback */
        }
      `}</style>
        </div>
    );
}
