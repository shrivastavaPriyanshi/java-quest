import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateProgress } from "@/lib/api";
import { River } from "@/components/Level6/River";
import { Boat } from "@/components/Level6/Boat";

// 🌊 Stream Configurations & Quizzes
const stages = [
    {
        id: 1,
        operation: "Filter: Even Numbers",
        code: "stream.filter(n -> n % 2 == 0)",
        target: (n: number) => n % 2 === 0,
        quiz: {
            question: "Which Steam operation is used to select elements based on a condition?",
            options: ["stream.map()", "stream.filter()", "stream.reduce()", "stream.forEach()"],
            answer: "stream.filter()"
        }
    },
    {
        id: 2,
        operation: "Filter: Greater than 10",
        code: "stream.filter(n -> n > 10)",
        target: (n: number) => n > 10,
        quiz: {
            question: "What type of interface does filter() accept?",
            options: ["Function<T, R>", "Consumer<T>", "Predicate<T>", "Supplier<T>"],
            answer: "Predicate<T>"
        }
    },
    {
        id: 3,
        operation: "Filter: Multiples of 5",
        code: "stream.filter(n -> n % 5 == 0)",
        target: (n: number) => n % 5 === 0,
        quiz: {
            question: "Which of the following is a valid Lambda expression?",
            options: ["(x) => x * 2", "x -> x * 2", "x : x * 2", "function(x) { return x * 2 }"],
            answer: "x -> x * 2"
        }
    }
];

interface Item {
    id: number;
    val: number;
    lane: number; // 0, 1, 2
    y: number; // % from top
    type: "fish" | "rock" | "shield" | "energy";
}

const Level6 = () => {
    const navigate = useNavigate();

    // 🎮 Game State
    const [gameState, setGameState] = useState<"intro" | "quiz" | "stream" | "victory">("intro");
    const [lane, setLane] = useState(1); // 0, 1, 2
    const [score, setScore] = useState(0);
    const [items, setItems] = useState<Item[]>([]);
    const [stageIndex, setStageIndex] = useState(0);
    const [passed, setPassed] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [selectedOption, setSelectedOption] = useState("");

    // 🕹️ Arcade Stats
    const [shield, setShield] = useState(false);
    const [combo, setCombo] = useState(1);

    // 🕹️ Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== "stream") return;
            if (e.key === "ArrowLeft") setLane((prev) => Math.max(0, prev - 1));
            if (e.key === "ArrowRight") setLane((prev) => Math.min(2, prev + 1));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    // 🔄 Stream Game Loop
    useEffect(() => {
        if (gameState !== "stream") return;

        const loop = setInterval(() => {
            setItems((prev) => {
                // Move items down
                const moved = prev.map((item) => ({ ...item, y: item.y + 1.5 })).filter((item) => item.y < 110);

                // Spawn new item chance
                if (Math.random() < 0.05) {
                    const rand = Math.random();
                    let type: Item["type"] = "fish";
                    if (rand < 0.2) type = "rock";
                    else if (rand < 0.25) type = "shield";
                    else if (rand < 0.3) type = "energy";

                    moved.push({
                        id: Date.now(),
                        val: Math.floor(Math.random() * 50),
                        lane: Math.floor(Math.random() * 3),
                        y: -10,
                        type: type
                    });
                }
                return moved;
            });
        }, 50);

        return () => clearInterval(loop);
    }, [gameState]);

    // 💥 Collision Detection
    useEffect(() => {
        if (gameState !== "stream") return;

        const boatY = 80; // Boat is at bottom 20%
        const hitItem = items.find(
            (item) => item.lane === lane && item.y > boatY && item.y < boatY + 10
        );

        if (hitItem) {
            setItems(prev => prev.filter(i => i.id !== hitItem.id));

            if (hitItem.type === "shield") {
                setShield(true);
                setFeedback("🛡️ Shield Active! (Exception Handler)");
            } else if (hitItem.type === "energy") {
                setScore(s => s + 50);
                setFeedback("⚡ Energy Boost! +50");
            } else if (hitItem.type === "rock") {
                if (shield) {
                    setShield(false);
                    setFeedback("🛡️ Blocked! Shield Used.");
                } else {
                    setScore(s => Math.max(0, s - 10));
                    setCombo(1);
                    setFeedback("💥 Ouch! Combo Lost.");
                }
            } else {
                const isValid = stages[stageIndex].target(hitItem.val);
                if (isValid) {
                    const points = 20 * combo;
                    setScore(s => s + points);
                    setCombo(c => Math.min(c + 1, 5)); // Cap combo at 5x
                    setFeedback(`✅ Caught ${hitItem.val}! +${points} (x${combo})`);

                    // Stage Progression
                    if (score > 150) { // Increased threshold due to bonuses
                        if (stageIndex < stages.length - 1) {
                            setStageIndex(prev => prev + 1);
                            setGameState("quiz"); // Go to next quiz
                            setScore(0);
                            setItems([]);
                            setFeedback("");
                            setShield(false);
                            setCombo(1);
                            setSelectedOption("");
                        } else {
                            handleFinish(true);
                        }
                    }
                } else {
                    setScore(s => Math.max(0, s - 5));
                    setCombo(1);
                    setFeedback(`❌ Filtered out ${hitItem.val}. Combo Reset.`);
                }
            }
            setTimeout(() => setFeedback(""), 1200);
        }
    }, [items, lane, stageIndex, score, gameState, shield, combo]);

    const handleQuizAnswer = (option: string) => {
        if (selectedOption) return;
        setSelectedOption(option);

        if (option === stages[stageIndex].quiz.answer) {
            setFeedback("✅ Correct! Entering Stream...");
            setTimeout(() => {
                setGameState("stream");
                setFeedback("");
                setSelectedOption("");
            }, 1500);
        } else {
            setFeedback("❌ Incorrect. Try again.");
            setTimeout(() => setSelectedOption(""), 1000);
        }
    };

    const handleFinish = (win: boolean) => {
        setGameState("victory");
        setPassed(win);
        if (win) {
            localStorage.setItem("level6Completed", "true");
            const userId = localStorage.getItem("userId");
            if (userId) {
                updateProgress(userId, 100, ["Stream Surfer"])
                    .catch(err => console.error(err));
            }
        }
    };

    return (
        <div className="h-screen relative overflow-hidden font-sans bg-blue-200">
            <Header />
            <River />

            <main className="relative z-10 h-full flex flex-col items-center">

                {/* 📊 HUD */}
                {gameState === "stream" && (
                    <div className="absolute top-20 bg-white/90 px-6 py-3 rounded-xl shadow-xl flex gap-10 border-4 border-blue-500 z-50">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 font-bold uppercase">Pipeline Score</div>
                            <div className="text-2xl font-bold text-blue-600">{score}</div>
                        </div>
                        <div className="text-center border-l-2 pl-4 border-slate-300">
                            <div className="text-xs text-slate-500 font-bold uppercase">Multiplier</div>
                            <div className={`text-2xl font-bold ${combo > 1 ? "text-amber-500 animate-pulse" : "text-slate-400"}`}>x{combo}</div>
                        </div>
                        <div className="text-center border-l-2 pl-4 border-slate-300">
                            <div className="text-xs text-slate-500 font-bold uppercase">Status</div>
                            <div className="text-xl">{shield ? "🛡️ SAFE" : "⚠️ VULNERABLE"}</div>
                        </div>
                        <div className="text-center border-l-2 pl-4 border-slate-300">
                            <div className="text-xs text-slate-500 font-bold uppercase">Current Operation</div>
                            <div className="font-mono bg-slate-800 text-green-400 px-2 rounded mt-1 text-sm">
                                {stages[stageIndex].code}
                            </div>
                        </div>
                    </div>
                )}

                {/* 🎬 Intro */}
                {gameState === "intro" && (
                    <div className="mt-40 bg-white/95 p-10 rounded-2xl max-w-2xl text-center shadow-2xl border-4 border-blue-600">
                        <h1 className="text-5xl font-bold text-blue-600 mb-6 font-pixel">🌊 Stream Valley</h1>
                        <p className="text-xl mb-8">
                            Master Java Streams! <br />
                            1. Answer a <b>Quiz Question</b> to configure your pipeline. <br />
                            2. Ride the boat and <b>Filter Data</b> (catch matching fish).
                        </p>
                        <Button onClick={() => setGameState("quiz")} size="lg" className="text-xl bg-blue-600 hover:bg-blue-700">
                            Start Pipeline 🚣
                        </Button>
                    </div>
                )}

                {/* 🧩 Quiz Phase */}
                {gameState === "quiz" && (
                    <div className="mt-20 bg-white/95 p-8 rounded-2xl max-w-lg w-full shadow-2xl border-4 border-purple-500 z-50">
                        <h3 className="text-sm font-bold text-purple-600 uppercase mb-2">Configuration Phase {stageIndex + 1}/3</h3>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800">{stages[stageIndex].quiz.question}</h2>
                        <div className="grid gap-3">
                            {stages[stageIndex].quiz.options.map(opt => (
                                <Button
                                    key={opt}
                                    onClick={() => handleQuizAnswer(opt)}
                                    variant={selectedOption === opt ? (opt === stages[stageIndex].quiz.answer ? "default" : "destructive") : "outline"}
                                    className="w-full text-lg justify-start"
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                        {feedback && <div className="mt-4 text-center font-bold text-xl">{feedback}</div>}
                    </div>
                )}

                {/* 🛥️ Stream Game Area */}
                {gameState === "stream" && (
                    <>
                        {/* Lanes Hint */}
                        <div className="absolute inset-0 flex pointer-events-none opacity-10">
                            <div className="w-1/3 border-r border-black/20" />
                            <div className="w-1/3 border-r border-black/20" />
                        </div>

                        {/* Items */}
                        {items.map(item => (
                            <motion.div
                                key={item.id}
                                className="absolute w-20 h-20 flex items-center justify-center text-4xl font-bold"
                                style={{
                                    top: `${item.y}%`,
                                    left: item.lane === 0 ? "25%" : item.lane === 1 ? "50%" : "75%",
                                    translateX: "-50%"
                                }}
                            >
                                {item.type === "fish" ? (
                                    <div className="relative">
                                        🐟
                                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm pt-2">{item.val}</span>
                                    </div>
                                ) : item.type === "rock" ? "🪨"
                                    : item.type === "shield" ? "🛡️"
                                        : "⚡"}
                            </motion.div>
                        ))}

                        <div className={shield ? "drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" : ""}>
                            <Boat lane={lane} />
                        </div>

                        {/* Feedback Toast */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                    className="absolute bottom-40 bg-white px-6 py-2 rounded-full font-bold shadow-lg z-50"
                                >
                                    {feedback}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}

                {/* 🏆 Victory */}
                {gameState === "victory" && (
                    <div className="mt-40 bg-white/95 p-10 rounded-2xl text-center shadow-2xl border-4 border-green-500">
                        <div className="text-8xl mb-4">👑</div>
                        <h2 className="text-4xl font-bold text-green-600 mb-4">Stream Master!</h2>
                        <p className="text-lg mb-6">
                            You configured the pipeline correctly and processed all data! <br />
                            +100 XP Earned!
                        </p>
                        <Button onClick={() => navigate("/map")} size="lg">Return to Map</Button>
                    </div>
                )}

            </main>

            {/* 📱 Mobile Controls */}
            {gameState === "stream" && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-between px-10 pointer-events-auto z-50">
                    <Button size="lg" className="h-20 w-20 rounded-full bg-white/50 text-4xl" onClick={() => setLane(l => Math.max(0, l - 1))}>⬅️</Button>
                    <Button size="lg" className="h-20 w-20 rounded-full bg-white/50 text-4xl" onClick={() => setLane(l => Math.min(2, l + 1))}>➡️</Button>
                </div>
            )}

        </div>
    );
};

export default Level6;
