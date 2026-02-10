import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bug, Clock, Trophy, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { toast } from "sonner";

// Mock Daily Questions
const DAILY_QUESTIONS = [
    {
        id: 1,
        question: "What is the default value of an `int` variable in a class?",
        options: ["0", "1", "null", "undefined"],
        correct: 0,
        snippet: null
    },
    {
        id: 2,
        question: "What is the output of this code?",
        snippet: `System.out.println(10 + 20 + "Java");`,
        options: ["1020Java", "30Java", "Java30", "Error"],
        correct: 1 // 10+20=30 -> "30Java"
    },
    {
        id: 3,
        question: "Find the bug in this array access:",
        snippet: `int[] arr = {1, 2, 3};
System.out.println(arr[3]);`,
        options: ["Syntax Error", "Prints 3", "ArrayIndexOutOfBoundsException", "Prints 0"],
        correct: 2 // Index 3 is out of bounds
    },
    {
        id: 4,
        question: "Which keyword is used for inheritance in Java?",
        options: ["implements", "extends", "inherits", "super"],
        correct: 1,
        snippet: null
    },
    {
        id: 5,
        question: "What is the result of this logic?",
        snippet: `boolean result = (5 > 3) && (8 < 5);`,
        options: ["true", "false", "null", "Compilation Error"],
        correct: 1 // true && false -> false
    }
];

export const DailyChallenge = () => {
    const navigate = useNavigate();
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false); // Show result of current question

    const currentQuestion = DAILY_QUESTIONS[currentQuestionIdx];

    const handleOptionSelect = (idx: number) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(idx);
        setShowResult(true);

        if (idx === currentQuestion.correct) {
            setScore(prev => prev + 1);
            toast.success("Correct! 🎯");
        } else {
            toast.error("Oops! That's a bug. 🐛");
        }

        // Auto advance after short delay
        setTimeout(() => {
            if (currentQuestionIdx < DAILY_QUESTIONS.length - 1) {
                setCurrentQuestionIdx(prev => prev + 1);
                setSelectedOption(null);
                setShowResult(false);
            } else {
                finishChallenge();
            }
        }, 1500);
    };

    const finishChallenge = () => {
        setIsCompleted(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        // Save completion status (mock)
        localStorage.setItem("dailyChallengeCompleted", new Date().toDateString());

        // Award XP
        const earnedXP = score * 20 + 50; // Base 50 + 20 per correct
        const currentXP = parseInt(localStorage.getItem("xp") || "0");
        localStorage.setItem("xp", (currentXP + earnedXP).toString());
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col">
            <Header fluid={true} />

            <main className="flex-1 max-w-3xl mx-auto w-full p-6 flex flex-col justify-center">

                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft size={20} /> Give Up
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                        <Clock size={20} />
                        <span>Daily Bug Hunt</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!isCompleted ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
                        >
                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full bg-amber-500 transition-all duration-300"
                                    style={{ width: `${((currentQuestionIdx) / DAILY_QUESTIONS.length) * 100}%` }}
                                />
                            </div>

                            <div className="mt-4 mb-8">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIdx + 1} of {DAILY_QUESTIONS.length}</span>
                                <h2 className="text-2xl md:text-3xl font-bold mt-2">{currentQuestion.question}</h2>

                                {currentQuestion.snippet && (
                                    <pre className="mt-4 bg-slate-100 dark:bg-slate-950 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-slate-200 dark:border-slate-800">
                                        <code>{currentQuestion.snippet}</code>
                                    </pre>
                                )}
                            </div>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, idx) => {
                                    let stateClass = "border-slate-200 dark:border-slate-700 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20";

                                    if (selectedOption !== null) {
                                        if (idx === currentQuestion.correct) {
                                            stateClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                                        } else if (idx === selectedOption) {
                                            stateClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                                        } else {
                                            stateClass = "opacity-50 border-slate-200 dark:border-slate-800";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            disabled={selectedOption !== null}
                                            className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex items-center justify-between group ${stateClass}`}
                                        >
                                            <span>{option}</span>
                                            {selectedOption !== null && idx === currentQuestion.correct && <CheckCircle2 size={20} className="text-green-500" />}
                                            {selectedOption === idx && idx !== currentQuestion.correct && <XCircle size={20} className="text-red-500" />}
                                        </button>
                                    );
                                })}
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-800 text-center"
                        >
                            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trophy size={48} className="text-amber-500" />
                            </div>

                            <h2 className="text-3xl font-bold mb-2">Bug Hunt Complete!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">
                                You scored <span className="text-amber-500 font-bold">{score} / {DAILY_QUESTIONS.length}</span> and earned XP!
                            </p>

                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                    <span className="block text-sm text-slate-500 uppercase">XP Earned</span>
                                    <span className="text-2xl font-bold text-violet-500">+{score * 20 + 50}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                    <span className="block text-sm text-slate-500 uppercase">Streak</span>
                                    <span className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                                        <span className="text-lg">🔥</span> Saved
                                    </span>
                                </div>
                            </div>

                            <Button onClick={() => navigate("/")} className="w-full h-12 text-lg rounded-xl bg-violet-600 hover:bg-violet-700 font-bold shadow-lg shadow-violet-500/30">
                                Continue Journey 🚀
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};
