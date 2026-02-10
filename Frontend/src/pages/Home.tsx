
import { Header } from "@/components/Layout/Header";
import { BackgroundParticles } from "@/components/Dashboard/BackgroundParticles";
import { DashboardHUD } from "@/components/Dashboard/DashboardHUD";
import { AIChatBot } from "@/components/AIChatBot";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Map as MapIcon, Trophy, Users, Code2, Lock, CheckCircle2, Book, Bug, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const LEVELS = [
  { id: 1, name: "Village", icon: "🏘️" },
  { id: 2, name: "Forest", icon: "🌲" },
  { id: 3, name: "Desert", icon: "🏜️" },
  { id: 4, name: "Castle", icon: "🏰" },
  { id: 5, name: "Jungle", icon: "🌴" },
  { id: 6, name: "Valley", icon: "🌊" },
];

const Home = () => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    // Check completed levels
    const completed = [];
    for (let i = 1; i <= 6; i++) {
      if (localStorage.getItem(`level${i}Completed`)) {
        completed.push(i);
      }
    }
    setCompletedLevels(completed);
  }, []);

  const nextLevel = completedLevels.length + 1 > 6 ? 6 : completedLevels.length + 1;

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden transition-colors duration-500">
      <BackgroundParticles />
      <Header fluid={true} />

      <main className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-8 flex flex-col">

        {/* 1. HUD Section */}
        <DashboardHUD />

        {/* 2. Hero Action Section */}
        <div className="text-center mb-16 space-y-6 mt-10">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] dark:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] font-pixel tracking-wide"
          >
            JAVA QUEST
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
          >
            Master the code. Defeat the bugs. Save the Kingdom.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-8"
          >
            <Link to={`/level${nextLevel}`}>
              <Button className="h-20 px-16 text-3xl font-bold rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(124,58,237,0.6)] border-2 border-white/20">
                <Play className="mr-4 fill-current" size={32} />
                CONTINUE QUEST
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 3. Adventure Map Preview */}
        <div className="w-full mb-16">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white"><MapIcon className="w-8 h-8 text-yellow-500 dark:text-yellow-400" /> Adventure Map</h3>
            <Link to="/map" className="text-lg text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 font-semibold">View Full Map →</Link>
          </div>

          <div className="relative bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-10 backdrop-blur-sm overflow-hidden shadow-xl dark:shadow-none">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-300 dark:bg-slate-700 -translate-y-1/2 z-0" />

            <div className="relative z-10 flex justify-between items-center overflow-x-auto pb-4 md:pb-0 gap-10 min-w-max md:min-w-0 px-4">
              {LEVELS.map((level) => {
                const isCompleted = completedLevels.includes(level.id);
                const isUnlocked = level.id === nextLevel || isCompleted;
                const isNext = level.id === nextLevel;

                return (
                  <Link
                    to={isUnlocked ? `/level${level.id}` : "#"}
                    key={level.id}
                    className={`flex flex-col items-center gap-4 transition-all ${isUnlocked ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed grayscale'}`}
                  >
                    <motion.div
                      whileHover={isUnlocked ? { scale: 1.2, rotate: 5 } : {}}
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-4 shadow-xl relative
                                        ${isCompleted ? 'bg-green-500 border-green-300 text-white' : isNext ? 'bg-indigo-600 border-indigo-400 animate-pulse text-white' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'}
                                    `}
                    >
                      {level.icon}
                      {isCompleted && <div className="absolute -top-3 -right-3 bg-yellow-400 rounded-full p-1.5 text-black shadow-sm"><CheckCircle2 size={16} /></div>}
                      {!isUnlocked && <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/40 rounded-xl"><Lock size={24} className="text-slate-500 dark:text-white" /></div>}
                    </motion.div>
                    <span className={`font-bold text-lg ${isNext ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-500'}`}>{level.id}. {level.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Quick Actions Grid - Updated to include Bug Hunt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 w-full auto-rows-fr">

          {/* Featured Bug Hunt Card */}
          <Link to="/daily-bug-hunt" className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/50 p-8 rounded-3xl flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-orange-500/20 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-white">
                    <Bug size={32} />
                  </div>
                  <span className="bg-orange-800/30 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    Resets in 14h 30m
                  </span>
                </div>
                <h4 className="font-bold text-3xl text-white mb-2">Today's Bug Hunt</h4>
                <p className="text-orange-100 text-lg leading-relaxed">
                  Slay 5 bugs to earn <span className="font-bold text-white">+150 XP</span> and keep your streak alive!
                </p>
              </div>

              <Button className="mt-8 w-full bg-white text-orange-600 hover:bg-orange-50 border-0 font-bold text-lg h-12 shadow-lg group-hover:scale-[1.02] transition-transform">
                Start Challenge
              </Button>
            </motion.div>
          </Link>

          {[
            { title: "Study Hub", icon: <Book size={32} />, color: "from-indigo-500 to-purple-500", link: "/notes", desc: "Access notes" },
            { title: "Skill Tree", icon: <Sprout size={32} />, color: "from-emerald-500 to-teal-500", link: "/skills", desc: "View progress" },
            { title: "Playground", icon: <Code2 size={32} />, color: "from-pink-500 to-rose-500", link: "/playground", desc: "Code lab" },
            { title: "Leaderboard", icon: <Trophy size={32} />, color: "from-blue-400 to-cyan-400", link: "/leaderboard", desc: "Rankings" },
          ].map((item, idx) => (
            <Link to={item.link} key={idx} className="lg:col-span-1">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 p-6 rounded-3xl flex flex-col gap-4 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer shadow-lg dark:shadow-none h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </main>

      {/* Floating AI Bot */}
      <AIChatBot />
    </div>
  );
};

export default Home;