import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateProgress } from "@/lib/api";
import { Branch } from "@/components/Level2/Branch";
import { JumpingCharacter } from "@/components/Level2/JumpingCharacter"; // Correct path

// 🌲 OOP Forest Questions
const questions = [
  {
    id: 1,
    text: "Which keyword is used to create a class in Java?",
    options: ["class", "Class", "define", "struct"],
    answer: "class",
  },
  {
    id: 2,
    text: "How do you create an object of class 'Car'?",
    options: [
      "Car c = Car();",
      "Car c = new Car();",
      "new Car c;",
      "Car c = new();",
    ],
    answer: "Car c = new Car();",
  },
  {
    id: 3,
    text: "What is encapsulation?",
    options: [
      "Hiding data",
      "Multiple inheritance",
      "Copying code",
      "Deleting objects",
    ],
    answer: "Hiding data",
  },
  {
    id: 4,
    text: "Which concept allows inheriting properties?",
    options: ["Polymorphism", "Abstraction", "Inheritance", "Arrays"],
    answer: "Inheritance",
  },
  {
    id: 5,
    text: "What is the parent class of all classes in Java?",
    options: ["Object", "String", "Main", "Class"],
    answer: "Object",
  },
];

const Level2 = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🎮 Game State
  const [started, setStarted] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(0); // 0 = Ground
  const [status, setStatus] = useState<"idle" | "jumping" | "falling">("idle");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);

  // 📷 Camera Scroll
  useEffect(() => {
    // Scroll to the active branch
    const el = document.getElementById(`branch-${currentBranch}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentBranch, started]);

  const handleAnswer = (option: string, qIndex: number) => {
    const isCorrect = option === questions[qIndex].answer;

    if (isCorrect) {
      setStatus("jumping");
      // Play jump sound
      setTimeout(() => {
        setCurrentBranch((prev) => prev + 1);
        setScore((s) => s + 20);
        setStatus("idle");

        if (currentBranch + 1 >= questions.length) {
          handleFinish(true);
        }
      }, 600); // Wait for jump animation
    } else {
      setStatus("falling");
      // Play fall sound
      setTimeout(() => {
        setCurrentBranch((prev) => Math.max(0, prev - 1));
        // setScore((s) => Math.max(0, s - 10)); // Optional penalty
        setStatus("idle");
      }, 800);
    }
  };

  const handleFinish = (win: boolean) => {
    setTimeout(() => {
      setFinished(true);
      setPassed(win);
      if (win) {
        localStorage.setItem("level2Completed", "true");
        // Sync with backend
        const userId = localStorage.getItem("userId");
        if (userId) {
          updateProgress(userId, 100, ["Forest Ranger"])
            .catch(err => console.error(err));
        }
      }
    }, 1000);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-sky-200 to-green-100 flex flex-col">
      <Header />

      {/* 🌤️ Parallax Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-9xl text-white/60"
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >☁️</motion.div>
        <motion.div
          className="absolute top-40 right-20 text-8xl text-white/50"
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        >☁️</motion.div>
      </div>

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth" ref={scrollRef}>

        {/* 📜 Intro Screen */}
        {!started && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
            <h1 className="text-5xl font-bold font-pixel mb-6 text-green-400">🌲 OOP Forest</h1>
            <p className="text-xl mb-8 max-w-lg text-center">
              Climb the Tree of Knowledge! <br />
              Answer correctly to jump UP. <br />
              Wrong answers make you fall DOWN.
            </p>
            <Button onClick={() => setStarted(true)} size="lg" className="text-xl px-10 py-6 bg-green-600 hover:bg-green-700">
              Start Climbing 🐒
            </Button>
          </div>
        )}

        {/* 🌳 The Giant Tree Container */}
        <div
          className="relative w-full max-w-3xl mx-auto pb-20 pt-[60vh]" // Added padding to push content
        >

          {/* Trunk */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-32 bg-amber-900 rounded-t-full shadow-2xl" />

          {/* Ground */}
          <div className="absolute bottom-0 w-full h-24 bg-green-800 z-10 border-t-8 border-green-900" />

          {/* 🌿 Branches & Questions */}
          <div className="flex flex-col-reverse relative z-10">
            {questions.map((q, index) => (
              <div id={`branch-${index}`} key={q.id} className="relative py-12">
                <Branch
                  question={q.text}
                  options={q.options}
                  onSelect={(opt) => handleAnswer(opt, index)}
                  isActive={index === currentBranch}
                  align={index % 2 === 0 ? "left" : "right"}
                  disabled={finished || index !== currentBranch}
                />

                {/* 🐒 Character Positioned Relative to Branch */}
                {currentBranch === index && !finished && (
                  <div className={`absolute bottom-20 transition-all duration-500 z-50 ${index % 2 === 0 ? "left-[15%]" : "right-[15%]"}`}>
                    <JumpingCharacter
                      branchIndex={0} // Relative to parent
                      status={status}
                      align={index % 2 === 0 ? "left" : "right"}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 🐒 Character - Removed global absolute one, now nested */}

        </div>

        {/* 📊 HUD */}
        <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-xl shadow-lg z-40">
          <div className="text-xs font-bold text-slate-500">HEIGHT</div>
          <div className="text-2xl font-bold text-green-600">{currentBranch * 10}m</div>
        </div>

      </main>

      {/* 🏆 Win Screen */}
      {finished && passed && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-9xl mb-4">👑</motion.div>
          <h2 className="text-5xl font-bold text-yellow-400 mb-4">Tree Top Reached!</h2>
          <p className="text-xl mb-8">+100 XP Earned</p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/map")} variant="secondary" size="lg">Map</Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="text-black" size="lg">Play Again</Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Level2;
