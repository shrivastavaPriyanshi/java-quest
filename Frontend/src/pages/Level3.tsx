import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateProgress } from "@/lib/api";
import { WaterMeter } from "@/components/Level3/WaterMeter";

// 🏜️ Exception Handling Questions
const questions = [
  {
    id: 1,
    text: "What happens when an exception is not handled in Java?",
    options: [
      "The program crashes",
      "It automatically retries",
      "It ignores the error",
    ],
    answer: "The program crashes",
    damage: 20,
    heal: 30
  },
  {
    id: 2,
    text: "Which block is ALWAYS executed after try-catch?",
    options: ["catch", "throw", "finally"],
    answer: "finally",
    damage: 15,
    heal: 25
  },
  {
    id: 3,
    text: "Dividing by zero causes which exception?",
    options: [
      "NullPointerException",
      "ArithmeticException",
      "IOException",
    ],
    answer: "ArithmeticException",
    damage: 25,
    heal: 35
  },
  {
    id: 4,
    text: "How do you manually throw an exception?",
    options: ["throw new Exception()", "throws Exception", "try Exception"],
    answer: "throw new Exception()",
    damage: 20,
    heal: 30
  },
  {
    id: 5,
    text: "Which keyword declares that a method MIGHT throw an exception?",
    options: ["throw", "throws", "try"],
    answer: "throws",
    damage: 15,
    heal: 30
  },
];

const Level3 = () => {
  const navigate = useNavigate();

  // 🎮 Game State
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [water, setWater] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);

  // 🐫 Character
  const [avatarX, setAvatarX] = useState(10);
  const [status, setStatus] = useState<"idle" | "walking" | "drinking" | "hit">("idle");
  const [feedback, setFeedback] = useState("");

  // 🔥 Heat Drain Effect
  useEffect(() => {
    if (started && !finished && !isGameOver) {
      const timer = setInterval(() => {
        setWater((prev) => {
          const newValue = prev - 0.8; // Drain 0.8% every tick
          if (newValue <= 0) {
            setIsGameOver(true);
            return 0;
          }
          return newValue;
        });
      }, 200); // Fast ticks for smooth bar

      return () => clearInterval(timer);
    }
  }, [started, finished, isGameOver]);

  const handleAnswer = (option: string) => {
    const q = questions[currentQ];
    const isCorrect = option === q.answer;

    if (isCorrect) {
      setStatus("drinking");
      setFeedback("💧 Refilled! Exception Handled.");
      setWater((prev) => Math.min(100, prev + q.heal));

      setTimeout(() => {
        setStatus("walking");
        setAvatarX((prev) => prev + 15); // Move forward relative %

        if (currentQ + 1 < questions.length) {
          setCurrentQ((p) => p + 1);
          setStatus("idle");
          setFeedback("");
        } else {
          handleFinish(true);
        }
      }, 1500);

    } else {
      setStatus("hit");
      setFeedback("🔥 Ouch! Unhandled Exception.");
      setWater((prev) => Math.max(0, prev - q.damage));

      setTimeout(() => setStatus("idle"), 800);
    }
  };

  const handleFinish = (win: boolean) => {
    setFinished(true);
    setPassed(win);
    if (win) {
      localStorage.setItem("level3Completed", "true");
      // Sync with backend
      const userId = localStorage.getItem("userId");
      if (userId) {
        updateProgress(userId, 100, ["Desert Survivor"])
          .catch(err => console.error(err));
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-orange-100 font-sans">
      <Header />

      {/* ☀️ Heat Overlay - Red vignette increases as water drops */}
      <div
        className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, transparent 50%, red 100%)",
          opacity: Math.max(0, (50 - water) / 50) // Starts showing at 50% water
        }}
      />

      {/* 🏜️ Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2017/01/03/22/53/desert-1950455_1280.png')] bg-cover bg-bottom opacity-40 z-0"
        animate={{ x: [-50, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* ☀️ Sun */}
      <motion.div
        className="absolute top-10 right-10 text-9xl"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      >🌞</motion.div>


      <main className="relative container h-[calc(100vh-80px)] flex flex-col items-center justify-center z-20">

        {/* 💧 Water Meter (HUD) */}
        {started && !isGameOver && !finished && <WaterMeter water={water} />}

        {/* 📜 Intro Screen */}
        {!started && (
          <div className="bg-white/90 p-10 rounded-2xl shadow-2xl text-center max-w-2xl border-4 border-amber-500">
            <h1 className="text-5xl font-bold text-amber-600 mb-6 font-pixel">🏜️ Desert Survival</h1>
            <p className="text-xl text-slate-700 mb-8">
              Your water is leaking! 💧<br />
              Every second counts. <br />
              <b>Answer correctly</b> to handle exceptions and refill your bottle.<br />
              <b>Wrong answers</b> drain your water instantly!
            </p>
            <Button onClick={() => setStarted(true)} size="lg" className="text-2xl px-12 py-8 bg-amber-600 hover:bg-amber-700 shadow-xl">
              Start Surviving 🐪
            </Button>
          </div>
        )}

        {/* 🎮 Game Loop */}
        {started && !isGameOver && !finished && (
          <div className="w-full max-w-xl relative mt-20">

            {/* 🐪 Character Animation */}
            <motion.div
              className="text-8xl absolute -top-40 left-1/2 -translate-x-1/2"
              animate={
                status === "walking" ? { y: [0, -10, 0] } :
                  status === "drinking" ? { scale: 1.2, rotate: -10 } :
                    status === "hit" ? { x: [-10, 10, -10, 10, 0], color: "red" } : {}
              }
            >
              {status === "hit" ? "💀" : "🐪"}
            </motion.div>

            {/* 💬 Question */}
            <div className="bg-white/95 p-8 rounded-xl shadow-xl border-4 border-amber-300 text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                {questions[currentQ].text}
              </h2>

              <div className="grid gap-3">
                {questions[currentQ].options.map((opt) => (
                  <Button
                    key={opt}
                    onClick={() => status === "idle" && handleAnswer(opt)}
                    disabled={status !== "idle"}
                    variant="outline"
                    className="w-full text-lg py-6 hover:bg-amber-100 hover:border-amber-500"
                  >
                    {opt}
                  </Button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 font-bold text-lg ${feedback.includes("Refilled") ? "text-blue-600" : "text-red-500"}`}
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 💀 Game Over Screen */}
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-black/80 rounded-2xl p-10 text-center text-white border-4 border-red-600"
          >
            <div className="text-8xl mb-4">☠️</div>
            <h2 className="text-5xl font-bold text-red-500 mb-4">Program Crashed!</h2>
            <p className="text-xl mb-8">You ran out of water (resources). Unhandled Exception Fatal Error.</p>
            <Button onClick={() => window.location.reload()} size="lg" variant="destructive" className="text-xl">
              Try Again
            </Button>
          </motion.div>
        )}

        {/* 🏆 Victory Screen */}
        {finished && passed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 rounded-2xl p-10 text-center border-4 border-green-500 shadow-2xl"
          >
            <div className="text-8xl mb-4">🌴</div>
            <h2 className="text-5xl font-bold text-green-600 mb-4">Oasis Found!</h2>
            <p className="text-xl mb-8 text-slate-600">
              You survived the Exception Desert. <br />
              +100 XP Earned!
            </p>
            <Button onClick={() => navigate("/map")} size="lg" className="text-xl bg-green-600 hover:bg-green-700">
              Continue Journey
            </Button>
          </motion.div>
        )}

      </main>
    </div>
  );
};

export default Level3;
