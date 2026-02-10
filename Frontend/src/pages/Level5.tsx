import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateProgress } from "@/lib/api";
import { Mogli } from "@/components/Level5/Mogli";
import { Cage } from "@/components/Level5/Cage";
import { Lock, Unlock, Play } from "lucide-react";

// 🧵 Multithreading Questions
const questions = [
    {
        id: 1,
        text: "Shere Khan wakes up if multiple Moglis run at once! What is this problem called?",
        options: [
            "Race Condition",
            "Deadlock",
            "Fast Execution",
            "Stack Overflow",
        ],
        answer: "Race Condition",
    },
    {
        id: 2,
        text: "How do we stop Shere Khan from waking up?",
        options: [
            "Use 'synchronized' keyword",
            "Run faster",
            "Delete the threads",
            "Use 'static' keyword",
        ],
        answer: "Use 'synchronized' keyword",
    },
    {
        id: 3,
        text: "Synchronization ensures that...",
        options: [
            "Only one thread accesses the resource at a time",
            "All threads run at once",
            "The program runs slower",
            "Memory is freed",
        ],
        answer: "Only one thread accesses the resource at a time",
    },
];

interface MogliState {
    id: number;
    status: "idle" | "running" | "rescuing" | "caught" | "success";
}

const Level5 = () => {
    const navigate = useNavigate();

    // 🎮 Game State
    const [gameState, setGameState] = useState<"intro" | "playing" | "failed" | "quiz" | "victory">("intro");
    const [moglis, setMoglis] = useState<MogliState[]>([]);
    const [isLocked, setIsLocked] = useState(false); // Synchronization
    const [feedback, setFeedback] = useState("");
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizPassed, setQuizPassed] = useState(false);
    const [cageOpen, setCageOpen] = useState(false);

    // 🦁 Shere Khan State
    const [lionState, setLionState] = useState<"sleeping" | "waking" | "attacking">("sleeping");

    const startRescue = () => {
        setGameState("playing");
        setLionState("sleeping");
        setMoglis([
            { id: 1, status: "idle" },
            { id: 2, status: "idle" },
            { id: 3, status: "idle" }
        ]);

        // Scenario 1: No Lock -> Race Condition -> Attack
        if (!isLocked) {
            setFeedback("⚠️ Mogli Clones are rushing in!");

            // All run at once
            setTimeout(() => setMoglis(prev => prev.map(m => ({ ...m, status: "running" }))), 500);

            // Collision/Noise
            setTimeout(() => {
                setLionState("waking");
                setFeedback("🦁 ROAR!! Too much noise!");
            }, 1500);

            setTimeout(() => {
                setLionState("attacking");
                setMoglis(prev => prev.map(m => ({ ...m, status: "caught" })));
                setGameState("failed");
                setFeedback("❌ Mission Failed! Race Condition woke Shere Khan.");
            }, 2500);
        }
        // Scenario 2: Locked -> Stealth -> Success
        else {
            setFeedback("🔒 Stealth Mode Active (Synchronized)");

            const runMogli = (index: number, delay: number) => {
                setTimeout(() => {
                    setMoglis(prev => prev.map((m, i) => i === index ? { ...m, status: "running" } : m));
                }, delay);

                setTimeout(() => {
                    setMoglis(prev => prev.map((m, i) => i === index ? { ...m, status: "rescuing" } : m));
                }, delay + 2000);

                setTimeout(() => {
                    setMoglis(prev => prev.map((m, i) => i === index ? { ...m, status: "success" } : m));
                }, delay + 3000);
            };

            // Run one by one
            runMogli(0, 0);
            runMogli(1, 4000);
            runMogli(2, 8000);

            setTimeout(() => {
                setCageOpen(true);
                setGameState("victory");
                handleLevelComplete();
            }, 12000);
        }
    };

    const handleQuizAnswer = (option: string) => {
        if (option === questions[quizIndex].answer) {
            if (quizIndex + 1 < questions.length) {
                setQuizIndex(prev => prev + 1);
                setFeedback("✅ Correct!");
            } else {
                setQuizPassed(true);
                setGameState("intro"); // Go back to start screen but updated
                setFeedback("🔓 Stealth Mode Unlocked! Enable it to win.");
            }
        } else {
            setFeedback("❌ Wrong! Try again.");
        }
    };

    const handleLevelComplete = () => {
        localStorage.setItem("level5Completed", "true");
        const userId = localStorage.getItem("userId");
        if (userId) {
            updateProgress(userId, 100, ["Jungle Savior"])
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-emerald-900 font-sans text-white">
            <Header />

            {/* 🌿 Deep Jungle BG */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2019/08/21/11/48/jungle-4420864_1280.png')] bg-cover opacity-30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
            </div>

            <main className="relative z-10 container h-[calc(100vh-80px)] flex flex-col items-center justify-center">

                {/* 🎬 Intro / Control Panel */}
                {gameState === "intro" && (
                    <div className="bg-black/80 p-8 rounded-2xl max-w-2xl text-center border-4 border-green-500 shadow-2xl backdrop-blur-md">
                        <h1 className="text-5xl font-bold text-green-400 mb-6 font-pixel">🐯 Jungle Rescue</h1>

                        {!quizPassed ? (
                            <>
                                <p className="text-xl mb-6">
                                    Animals are trapped in Shere Khan's cage! <br />
                                    You have 3 Mogli Helpers (Threads). <br />
                                    <b>Problem:</b> If they all run at once, they make noise (Race Condition) and wake the Tiger.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button onClick={startRescue} size="lg" className="bg-red-600 hover:bg-red-700 text-lg">
                                        <Play className="mr-2" /> Attempt Rescue (Unsafe)
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-xl mb-6 text-green-300">
                                    ✨ You learned <b>Synchronization</b>! <br />
                                    Enable <b>Stealth Mode</b> to save them one by one.
                                </p>
                                <div className="flex justify-center gap-4 items-center">
                                    <Button
                                        onClick={() => setIsLocked(!isLocked)}
                                        size="lg"
                                        className={`text-lg transition-all ${isLocked ? "bg-blue-600 ring-4 ring-blue-300" : "bg-slate-600"}`}
                                    >
                                        {isLocked ? <Lock className="mr-2" /> : <Unlock className="mr-2" />}
                                        {isLocked ? "Stealth Mode ON" : "Stealth Mode OFF"}
                                    </Button>

                                    <Button onClick={startRescue} size="lg" className="bg-green-600 hover:bg-green-700 text-lg">
                                        <Play className="mr-2" /> Start Rescue
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ❌ Fail Screen -> Prompt Quiz */}
                {gameState === "failed" && (
                    <div className="bg-red-900/90 p-8 rounded-2xl text-center border-4 border-red-500 shadow-2xl z-50">
                        <h2 className="text-4xl font-bold mb-4">💀 Mogli Caught!</h2>
                        <p className="text-xl mb-6">
                            Race Condition! The threads clashed and woke the beast. <br />
                            You need to <b>Synchronize</b> them.
                        </p>
                        <Button onClick={() => setGameState("quiz")} size="lg" className="bg-white text-red-900 hover:bg-gray-200">
                            Learn How to Fix This 🧠
                        </Button>
                    </div>
                )}

                {/* 🧠 Quiz Modal */}
                {gameState === "quiz" && (
                    <div className="bg-slate-800 p-8 rounded-2xl max-w-lg w-full border-4 border-blue-500 shadow-2xl z-50">
                        <h3 className="text-sm font-bold text-blue-300 uppercase mb-2">Training Module {quizIndex + 1}/3</h3>
                        <h2 className="text-2xl font-bold mb-6">{questions[quizIndex].text}</h2>
                        <div className="grid gap-3 mb-4">
                            {questions[quizIndex].options.map(opt => (
                                <Button key={opt} onClick={() => handleQuizAnswer(opt)} variant="outline" className="text-left justify-start text-black">
                                    {opt}
                                </Button>
                            ))}
                        </div>
                        {feedback && <div className="text-center font-bold">{feedback}</div>}
                    </div>
                )}

                {/* 🏆 Victory */}
                {gameState === "victory" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white/90 text-black p-10 rounded-2xl text-center shadow-2xl border-4 border-yellow-400 z-50"
                    >
                        <div className="text-8xl mb-4">🎉</div>
                        <h2 className="text-4xl font-bold text-green-700 mb-4">Mission Accomplished!</h2>
                        <p className="text-lg mb-6">
                            You used <b>Synchronization</b> to prevent Race Conditions. <br />
                            The animals are free! +100 XP
                        </p>
                        <Button onClick={() => navigate("/map")} size="lg" className="text-lg">
                            Return to Map
                        </Button>
                    </motion.div>
                )}

                {/* 🎭 Game Scene */}
                {(gameState === "playing" || gameState === "failed" || gameState === "victory") && (
                    <>
                        {/* 🏡 Cage & Lion */}
                        <Cage isOpen={cageOpen} />

                        {/* 🦁 Lion Effect */}
                        {lionState === "waking" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.5 }}
                                className="absolute bottom-40 right-40 text-8xl z-30 font-bold text-red-500"
                            >
                                ❗ ? ❗
                            </motion.div>
                        )}

                        {/* 👦 Moglis */}
                        {moglis.map((m, i) => (
                            <Mogli key={m.id} {...m} delay={i * 200} />
                        ))}

                        {/* 📢 HUD Feedback */}
                        <div className="absolute top-10 bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm text-xl font-bold">
                            {feedback}
                        </div>
                    </>
                )}

            </main>
        </div>
    );
};

export default Level5;
