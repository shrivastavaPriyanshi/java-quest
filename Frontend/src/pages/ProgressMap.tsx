import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Layout/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Star, Trophy, CheckCircle2, Info,
  Home, Trees, Sun, Castle, Sprout, Waves,
  FileText, Database, Cpu, Sigma, LayoutTemplate,
  Leaf, ShieldCheck, Crown, Sun as SunIcon, Moon
} from "lucide-react";

// --- Types ---
type Stage = {
  id: number;
  name: string;
  desc: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Boss";
  color: string;
  theme: string; // CSS class for background
  image: string; // URL for the level image
  Icon: React.ElementType;
};

// --- Data ---
const STAGES: Stage[] = [
  { id: 1, name: "Beginner Village", desc: "Java basics & syntax", difficulty: "Easy", color: "bg-green-500", theme: "from-green-900 to-green-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20rpg%20village%20sunny%20green?width=200&height=200&nologo=true", Icon: Home },
  { id: 2, name: "OOP Forest", desc: "Classes & Objects", difficulty: "Medium", color: "bg-emerald-600", theme: "from-emerald-900 to-emerald-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20mystical%20forest%20trees?width=200&height=200&nologo=true", Icon: Trees },
  { id: 3, name: "Exception Desert", desc: "Try-Catch & Errors", difficulty: "Medium", color: "bg-amber-500", theme: "from-amber-900 to-amber-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20desert%20dunes%20cactus?width=200&height=200&nologo=true", Icon: Sun },
  { id: 4, name: "Collection Castle", desc: "Lists, Sets, Maps", difficulty: "Hard", color: "bg-purple-600", theme: "from-purple-900 to-purple-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20medieval%20castle%20stone?width=200&height=200&nologo=true", Icon: Castle },
  { id: 5, name: "Thread Jungle", desc: "Multithreading", difficulty: "Hard", color: "bg-lime-600", theme: "from-lime-900 to-lime-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20dense%20jungle%20vines?width=200&height=200&nologo=true", Icon: Sprout },
  { id: 6, name: "Stream Valley", desc: "Streams API", difficulty: "Hard", color: "bg-blue-500", theme: "from-blue-900 to-blue-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20river%20valley%20water?width=200&height=200&nologo=true", Icon: Waves },
  // New Levels
  { id: 7, name: "File Harbor", desc: "File Handling & I/O", difficulty: "Medium", color: "bg-cyan-600", theme: "from-cyan-900 to-cyan-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20seaport%20harbor%20ships?width=200&height=200&nologo=true", Icon: FileText },
  { id: 8, name: "JDBC Bridge", desc: "Database Connectivity", difficulty: "Hard", color: "bg-rose-600", theme: "from-rose-900 to-rose-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20stone%20bridge%20sunset?width=200&height=200&nologo=true", Icon: Database },
  { id: 9, name: "Memory Mountain", desc: "Heap, Stack, GC", difficulty: "Hard", color: "bg-fuchsia-600", theme: "from-fuchsia-900 to-fuchsia-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20snowy%20mountain%20peak?width=200&height=200&nologo=true", Icon: Cpu },
  { id: 10, name: "Lambda Ocean", desc: "Functional Interfaces", difficulty: "Hard", color: "bg-sky-500", theme: "from-sky-900 to-sky-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20deep%20blue%20ocean%20waves?width=200&height=200&nologo=true", Icon: Sigma },
  { id: 11, name: "Design Pattern City", desc: "Singleton, Factory...", difficulty: "Hard", color: "bg-violet-600", theme: "from-violet-900 to-violet-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20futuristic%20city%20skyline?width=200&height=200&nologo=true", Icon: LayoutTemplate },
  { id: 12, name: "Spring Boot Valley", desc: "Framework Basics", difficulty: "Hard", color: "bg-emerald-500", theme: "from-emerald-900 to-emerald-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20spring%20meadow%20flowers?width=200&height=200&nologo=true", Icon: Leaf },
  { id: 13, name: "Testing Arena", desc: "JUnit & Mockito", difficulty: "Medium", color: "bg-red-500", theme: "from-red-900 to-red-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20gladiator%20arena%20coliseum?width=200&height=200&nologo=true", Icon: ShieldCheck },
  { id: 14, name: "Java Master Temple", desc: "Final Challenge", difficulty: "Boss", color: "bg-yellow-500", theme: "from-yellow-900 to-yellow-800", image: "https://image.pollinations.ai/prompt/pixel%20art%20golden%20temple%20shrine?width=200&height=200&nologo=true", Icon: Crown },
];

const ProgressMap = () => {
  const [xp, setXp] = useState(0);
  const [stagesCompleted, setStagesCompleted] = useState(0);
  const [badges, setBadges] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    }
    return true;
  });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  // Sync with Global Theme via MutationObserver
  useEffect(() => {
    // Initial check
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };
    checkTheme();

    // Observe changes to the class attribute on <html>
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load User Progress
    const completedCount = STAGES.filter((_, i) => localStorage.getItem(`level${i + 1}Completed`)).length;
    setStagesCompleted(completedCount);

    // XP & Badges
    const currentXp = Number(localStorage.getItem("xp") || 0);
    setXp(currentXp);
    setBadges(Math.floor(currentXp / 500));

    // Auto-scroll to current level
    setTimeout(() => {
      if (scrollRef.current) {
        const levelWidth = 350; // Approximated width per level section
        // Center the current level horizontally
        const targetScroll = (completedCount) * levelWidth - window.innerWidth / 2 + levelWidth / 2;
        scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const handleStageClick = (id: number) => {
    const unlocked = id <= stagesCompleted + 1;
    if (!unlocked) {
      toast.error("Level Locked! 🔒", {
        description: "Complete all previous levels to unlock this challenge.",
        duration: 3000,
        position: "top-center",
        style: {
          background: isDarkMode ? "#1f2937" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
          border: "1px solid " + (isDarkMode ? "#374151" : "#e5e7eb"),
        }
      });
      return;
    }
    window.location.href = `/level${id}`;
  };

  // SVG Path Calculation for a HORIZONTAL winding path
  const generatePath = () => {
    const stepWidth = 350;
    const startY = 300; // Center Vertically (assuming container is ~600px high)

    let d = `M 100 ${startY}`; // Start at left

    STAGES.forEach((_, i) => {
      const x = 100 + i * stepWidth;
      const nextX = 100 + (i + 1) * stepWidth;

      // Oscillate Up and Down
      const offset = (i % 2 === 0) ? -100 : 100;
      const nextOffset = ((i + 1) % 2 === 0) ? -100 : 100;

      const currentY = startY + offset;
      const nextY = startY + nextOffset;

      if (i === 0) {
        // Initial curve from start point to first node
        d = `M 100 ${startY} C ${x + 50} ${startY}, ${x - 50} ${currentY}, ${x} ${currentY}`;
      }

      if (i < STAGES.length - 1) {
        // Cubic Bezier to next point
        d += ` C ${x + 150} ${currentY}, ${nextX - 150} ${nextY}, ${nextX} ${nextY}`;
      }
    });

    return d;
  };

  return (
    <div
      className={`h-screen font-sans overflow-hidden flex flex-col relative transition-colors duration-500 ${isDarkMode ? "text-white" : "text-slate-900"}`}
      style={{ background: isDarkMode ? "linear-gradient(to bottom, #0B1026, #111827, #1A0B2E)" : "linear-gradient(to bottom, #f0f9ff, #e0f2fe, #bae6fd)" }}
    >
      {/* Background Texture - Low Opacity */}
      <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none z-0 ${isDarkMode ? "opacity-[0.06]" : "opacity-[0.15] invert"
        }`}></div>

      <div className="relative z-20 w-full">
        <Header />
      </div>

      {/* --- HUD --- */}
      <div className={`backdrop-blur-md border-b p-4 sticky top-0 z-40 shadow-xl transition-colors duration-500 ${isDarkMode
        ? "bg-slate-900/90 border-slate-700"
        : "bg-white/80 border-slate-200"
        }`}>
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=JavaMaster"
                alt="Hero"
                className="w-12 h-12 rounded-full border-2 border-yellow-400 bg-slate-800"
              />
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-slate-900 text-xs font-bold px-1.5 rounded-full">
                {Math.floor(xp / 100) + 1}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-yellow-400">Java Explorer</div>
              <div className="text-xs text-slate-400 space-x-2">
                <span>{xp} XP</span>
                <span>•</span>
                <span>{badges} Badges</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const newMode = !isDarkMode;
                setIsDarkMode(newMode);
                if (newMode) {
                  document.documentElement.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                } else {
                  document.documentElement.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                }
              }}
              className={`p-2 rounded-lg border transition-all z-50 ${isDarkMode
                ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDarkMode
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-slate-200 text-slate-800"
              }`}>
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold">{stagesCompleted}/{STAGES.length} Stages</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- HORIZONTAL MAP SCROLLER --- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar flex items-center z-10"
      >
        <div className="relative h-full flex items-center" style={{ minWidth: `${STAGES.length * 350 + 400}px` }}>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: Math.random() * 2000, y: Math.random() * 800, opacity: 0 }}
                animate={{ x: "-10%", opacity: [0, 0.5, 0] }}
                transition={{ duration: 30 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
                className="absolute text-slate-700 text-4xl"
              >
                {i % 3 === 0 ? "☁️" : i % 3 === 1 ? "✨" : "☕"}
              </motion.div>
            ))}
          </div>

          {/* The Path */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dashed background path */}
            <path
              d={generatePath()}
              stroke={isDarkMode ? "#334155" : "#cbd5e1"}
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />

            {/* Animated foreground path */}
            <path
              d={generatePath()}
              stroke="url(#pathGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="20 15"
              filter="url(#glow)"
              className="animate-pulse"
            />
          </svg>

          {/* Levels */}
          {STAGES.map((stage, i) => {
            const unlocked = stage.id <= stagesCompleted + 1;
            const completed = stage.id <= stagesCompleted;
            const isCurrent = stage.id === stagesCompleted + 1;
            const Icon = stage.Icon;

            // Positioning logic matching SVG
            const x = 100 + i * 350;
            const startY = 300;
            const offset = (i % 2 === 0) ? -100 : 100;
            const y = startY + offset;

            return (
              <div
                key={stage.id}
                className="absolute flex flex-col items-center z-10"
                style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
              >
                {/* Avatar on Current Level */}
                {isCurrent && (
                  <motion.div
                    initial={{ y: -50, scale: 0 }}
                    animate={{ y: -90, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="absolute z-20 pointer-events-none flex flex-col items-center"
                  >
                    <div className="w-20 h-20">
                      <img
                        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzc5ZnZqbnZ4Y3Z4bnZ4bnZ4bnZ4bnBxeHBi/26tn33aiTi1jkl6HK/giphy.gif"
                        alt="Running Character"
                        className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <div className="bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg -mt-2 animate-bounce">
                      You are here!
                    </div>
                  </motion.div>
                )}

                {/* Level Node */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: unlocked ? [0, -5, 5, 0] : 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStageClick(stage.id)}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  className={`
                    relative w-28 h-28 rounded-3xl rotate-45 border-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center -rotate-45-inner
                    transition-all duration-300 group overflow-hidden
                    ${completed
                      ? "bg-gradient-to-br from-green-500 to-emerald-700 border-white/20"
                      : unlocked
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-white ring-4 ring-blue-500/30 animate-pulse-slow"
                        : "bg-slate-800 border-slate-700 cursor-not-allowed opacity-80"
                    }
                  `}
                >
                  <div className="-rotate-45 w-full h-full flex items-center justify-center transition-all overflow-hidden relative">
                    {/* Image Background */}
                    <img
                      src={stage.image}
                      alt={stage.name}
                      className="absolute inset-0 w-full h-full object-cover scale-125 opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay Gradient & Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      {completed ? (
                        <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
                      ) : (
                        <Icon className="w-10 h-10 text-white drop-shadow-lg filter" />
                      )}
                    </div>
                  </div>

                  {/* Stars for completed */}
                  {completed && (
                    <div className="absolute -bottom-6 flex gap-1 transform -rotate-45">
                      {[1, 2, 3].map(s => <Star key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />)}
                    </div>
                  )}

                  {/* Lock Overlay for Locked Levels */}
                  {!unlocked && (
                    <div className="absolute inset-0 -rotate-45 flex items-center justify-center z-20 pointer-events-none">
                      <div className="bg-slate-900/60 p-2 rounded-full backdrop-blur-sm border border-white/10">
                        <Lock className="w-8 h-8 text-slate-400" />
                      </div>
                    </div>
                  )}
                </motion.button>

                {/* Floating Label */}
                <motion.div
                  className={`mt-12 px-5 py-3 backdrop-blur-md border rounded-xl text-center shadow-xl z-20 w-48 transition-colors duration-300
                    ${unlocked ? 'opacity-100' : 'opacity-60 grayscale'}
                    ${isDarkMode
                      ? "bg-slate-900/90 border-slate-700 text-white"
                      : "bg-white/90 border-slate-200 text-slate-900"
                    }
                  `}
                  animate={{ y: hoveredStage === stage.id ? -5 : 0 }}
                >
                  <div className={`text-xs uppercase tracking-widest font-bold mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}>Level {stage.id}</div>
                  <div className="font-bold text-sm">{stage.name}</div>
                </motion.div>

                {/* Difficulty Badge */}
                <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider
                  ${stage.difficulty === 'Easy' ? 'bg-green-900/50 border-green-500 text-green-400' :
                    stage.difficulty === 'Medium' ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400' :
                      'bg-red-900/50 border-red-500 text-red-400'}
                `}>
                  {stage.difficulty}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Global Elements */}
      <div className="absolute bottom-5 right-5 z-50">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 opacity-80 pointer-events-none"
        >
          <img src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Java Coffee" className="w-full h-full object-contain" />
        </motion.div>
      </div>

    </div>
  );
};

export default ProgressMap;
