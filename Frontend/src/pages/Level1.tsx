import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { useNavigate } from "react-router-dom";
import { updateProgress } from "@/lib/api";
import { Player } from "@/components/Level1/Player";
import { Door } from "@/components/Level1/Door";
import { QuestionCard } from "@/components/Level1/QuestionCard";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    text: "Which of the following correctly declares an integer variable in Java?",
    options: [
      { id: 0, text: "num = 5;", label: "A" },
      { id: 1, text: "int num = 5;", label: "B" },
      { id: 2, text: "integer num = 5;", label: "C" },
      { id: 3, text: "var num = 5;", label: "D" }
    ],
    answerLabel: "B",
    reward: "💎 Magic Crystal",
  },
  {
    id: 2,
    text: "What is the default value of an uninitialized boolean variable in Java?",
    options: [
      { id: 0, text: "true", label: "A" },
      { id: 1, text: "false", label: "B" },
      { id: 2, text: "0", label: "C" },
      { id: 3, text: "null", label: "D" }
    ],
    answerLabel: "B",
    reward: "🪙 Gold Coin",
  },
  {
    id: 3,
    text: "Which of these is NOT a primitive data type in Java?",
    options: [
      { id: 0, text: "int", label: "A" },
      { id: 1, text: "char", label: "B" },
      { id: 2, text: "String", label: "C" },
      { id: 3, text: "boolean", label: "D" }
    ],
    answerLabel: "C",
    reward: "⭐ Power Star",
  },
  {
    id: 4,
    text: "Which method is used to take input from the user in Java?",
    options: [
      { id: 0, text: "input()", label: "A" },
      { id: 1, text: "read()", label: "B" }, // Scanner.nextLine() was too long for door
      { id: 2, text: "Scanner.nextLine()", label: "C" },
      { id: 3, text: "System.read()", label: "D" }
    ],
    answerLabel: "C",
    reward: "🏆 Hero Badge",
  },
];

export default function Level1() {
  const navigate = useNavigate();

  // 🎮 Game State
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [xp, setXp] = useState(0);

  // 🏃‍♂️ Player Physics
  const [playerX, setPlayerX] = useState(10); // Percentage 0-100
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isWalking, setIsWalking] = useState(false);

  // 🚪 Interaction
  const [highlightedDoor, setHighlightedDoor] = useState<string | null>(null);
  const [doorStatus, setDoorStatus] = useState<Record<string, "idle" | "correct" | "wrong">>({});
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);

  // ⌨️ Keyboard Listeners
  useEffect(() => {
    if (!started || levelComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Setup movement speed
      const speed = 2.5;

      if (e.key === "ArrowRight") {
        setDirection("right");
        setIsWalking(true);
        setPlayerX((prev) => Math.min(95, prev + speed));
      } else if (e.key === "ArrowLeft") {
        setDirection("left");
        setIsWalking(true);
        setPlayerX((prev) => Math.max(5, prev - speed));
      } else if (e.key === "Enter") {
        if (highlightedDoor) handleAnswer(highlightedDoor);
      }
    };

    const handleKeyUp = () => setIsWalking(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [started, levelComplete, highlightedDoor, currentQ]);

  // 📍 Collision Detection with Doors
  useEffect(() => {
    const doorPositions = [20, 40, 60, 80]; // X percentages for doors A, B, C, D
    const options = questions[currentQ].options;

    let found = null;
    options.forEach((opt, index) => {
      const doorX = doorPositions[index];
      // Check if player is within range (e.g., +/- 5%)
      if (Math.abs(playerX - doorX) < 5) {
        found = opt.label;
      }
    });
    setHighlightedDoor(found);
  }, [playerX, currentQ]);

  const handleAnswer = (choiceLabel: string) => {
    const correct = choiceLabel === questions[currentQ].answerLabel;

    if (correct) {
      setFeedback("✅ Correct! +25 XP");
      setDoorStatus({ ...doorStatus, [choiceLabel]: "correct" });
      setXp((p) => p + 25);

      // Play sound effect (optional)
      // new Audio("/success.mp3").play().catch(() => {});

      setTimeout(() => {
        setDoorStatus({});
        setFeedback("");
        setPlayerX(10); // Reset position

        if (currentQ + 1 < questions.length) {
          setCurrentQ((p) => p + 1);
        } else {
          handleLevelComplete();
        }
      }, 1500);

    } else {
      setFeedback("❌ Wrong Door! Try again.");
      setDoorStatus({ ...doorStatus, [choiceLabel]: "wrong" });
      setTimeout(() => setDoorStatus((prev) => ({ ...prev, [choiceLabel]: "idle" })), 1000);
    }
  };

  const handleLevelComplete = () => {
    setLevelComplete(true);
    localStorage.setItem("level1Completed", "true");

    // Sync with backend
    const userId = localStorage.getItem("userId");
    if (userId) {
      updateProgress(userId, 100, ["Beginner Walker"])
        .catch(err => console.error(err));
    }
  };

  const doorPositions = [20, 40, 60, 80];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-300 via-emerald-200 to-green-100 select-none">
      <Header />

      {/* 🌤️ Background Clouds */}
      <motion.div
        className="absolute top-20 left-10 text-9xl opacity-50"
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      >
        ☁️
      </motion.div>

      <main className="container h-[calc(100vh-80px)] relative">

        {/* ===================== INTRO SCREEN ===================== */}
        {!started && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-6xl font-pixel text-primary mb-6 drop-shadow-xl">
              Beginner Village
            </h1>
            <p className="text-2xl text-slate-700 mb-10 max-w-2xl text-center">
              Use <kbd className="bg-white px-2 py-1 rounded shadow">⬅️</kbd>
              <kbd className="bg-white px-2 py-1 rounded shadow mx-2">➡️</kbd>
              to walk to the correct door.<br />
              Press <kbd className="bg-white px-2 py-1 rounded shadow">Enter</kbd> to unlock it!
            </p>
            <Button
              size="lg"
              className="px-12 py-8 text-2xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
              onClick={() => setStarted(true)}
            >
              Start Adventure 🏃
            </Button>
          </div>
        )}

        {/* ===================== GAME LOOP ===================== */}
        {started && !levelComplete && (
          <>
            {/* 📊 HUD */}
            <div className="absolute top-4 right-4 bg-white/80 p-4 rounded-xl shadow-lg z-50 flex gap-6">
              <div>
                <div className="text-xs text-slate-500 uppercase">XP</div>
                <div className="font-bold text-xl text-purple-600">{xp}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Level</div>
                <div className="font-bold text-xl text-blue-600">1</div>
              </div>
            </div>

            {/* ❓ Question */}
            <QuestionCard
              question={questions[currentQ].text}
              options={questions[currentQ].options}
              currentQ={currentQ}
              totalQ={questions.length}
            />

            {/* 📢 Feedback Banner */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`absolute top-48 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full text-white font-bold shadow-lg z-40 ${feedback.includes("Correct") ? "bg-green-500" : "bg-red-500"}`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🚪 Doors */}
            {questions[currentQ].options.map((opt, index) => (
              <Door
                key={opt.id}
                id={opt.id}
                label={opt.label}
                text={opt.text}
                // Only show text if highlighted? No, show text always for clarity
                isHighlighted={highlightedDoor === opt.label}
                status={doorStatus[opt.label] || "idle"}
                isUnlocked={doorStatus[opt.label] === "correct"}
                xPosition={doorPositions[index]}
              />
            ))}

            {/* 🧙‍♂️ Player */}
            <Player x={playerX} direction={direction} isWalking={isWalking} />

            {/* 🌿 Ground */}
            <div className="absolute bottom-0 w-full h-20 bg-emerald-600 border-t-8 border-emerald-700" />

            {/* 🎮 Mobile Controls (Visible only on small screens) */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between md:hidden">
              <Button
                onPointerDown={() => { setDirection("left"); setIsWalking(true); }}
                onPointerUp={() => setIsWalking(false)}
                className="h-16 w-16 text-3xl rounded-full opacity-80"
              >⬅️</Button>
              <Button
                onClick={() => highlightedDoor && handleAnswer(highlightedDoor)}
                className="h-16 w-16 rounded-full bg-yellow-400 text-black font-bold opacity-80"
              >OK</Button>
              <Button
                onPointerDown={() => { setDirection("right"); setIsWalking(true); }}
                onPointerUp={() => setIsWalking(false)}
                className="h-16 w-16 text-3xl rounded-full opacity-80"
              >➡️</Button>
            </div>
          </>
        )}

        {/* ===================== VICTORY SCREEN ===================== */}
        {levelComplete && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-9xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-5xl font-bold text-green-700 mb-4">Village Cleared!</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-lg">
              You unlocked all the doors and proved your Java knowledge!
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/map")} className="text-lg px-8 py-4">
                Continue Journey
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
