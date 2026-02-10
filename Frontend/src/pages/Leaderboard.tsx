import { Header } from "@/components/Layout/Header";
import { fetchLeaderboard } from "@/lib/api";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// 🎉 Floating emoji animation
const FloatingEmoji = ({ emoji }: { emoji: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: Math.random() * 800 - 400, scale: 0 }}
    animate={{
      opacity: [1, 0.8, 0],
      y: [50, -300],
      x: Math.random() * 300 - 150,
      scale: [1, 1.2, 0.8],
    }}
    transition={{ duration: 2.5, ease: "easeOut" }}
    className="fixed z-[9998] text-4xl select-none left-1/2 top-1/2"
  >
    {emoji}
  </motion.div>
);

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-quest-gold" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <Trophy className="w-5 h-5 text-muted-foreground" />;
  }
};

export const Leaderboard = () => {
  const location = useLocation();

  // 🧠 State for dynamic XP, badges, rank, animation
  const [xp, setXp] = useState<number>(0);
  const [badges, setBadges] = useState<number>(0);
  const [rank, setRank] = useState<number>(47);
  const [showReward, setShowReward] = useState(false);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string }[]>([]);

  // 🏆 Leaderboard data state
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  // 🌀 Fetch XP and Leaderboard
  useEffect(() => {
    // Load local user XP (for "Your Progress" section - usually this would also be an API call if we had auth context stored)
    const storedXp = Number(localStorage.getItem("xp") || 0);
    setXp(storedXp);
    setBadges(Math.floor(storedXp / 100));

    // Fetch global leaderboard
    fetchLeaderboard()
      .then((data) => {
        // Map API data to UI format
        const formattedData = data.map((user: any, index: number) => ({
          id: user._id,
          rank: index + 1,
          name: user.name,
          avatar: "🧙‍♂️", // Default avatar for now
          xp: user.xp,
          badges: user.badges.length,
          title: "Java Novice" // Dynamic title could be based on Level
        }));
        setLeaderboardData(formattedData);
      })
      .catch((err) => console.error(err));

    const rewardMsg = localStorage.getItem("reward");
    if (rewardMsg) {
      setShowReward(true);
      spawnEmojis();
      localStorage.removeItem("reward");
      const t = setTimeout(() => setShowReward(false), 4000);
      return () => clearTimeout(t);
    }
  }, [location.key]);

  // 🎊 Emoji burst
  const spawnEmojis = () => {
    const emojiSet = ["💰", "🏅", "⭐", "✨", "🎉"];
    emojiSet.forEach((emoji, i) => {
      const id = Date.now() + i;
      setTimeout(() => {
        setEmojis((prev) => [...prev, { id, emoji }]);
        setTimeout(() => setEmojis((prev) => prev.filter((e) => e.id !== id)), 2500);
      }, i * 180);
    });
  };

  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-quest-gold/10 relative"
    >
      <Header />

      <main className="container py-8">
        {/* 🏅 Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold font-pixel text-primary mb-3 tracking-wide">
            Hall of Fame
          </h1>
          <p className="text-lg text-muted-foreground font-poppins">
            The greatest Java adventurers in the realm ⚔️
          </p>
        </motion.div>

        {/* 👑 Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-14 flex items-end justify-center gap-6"
        >
          {leaderboardData.slice(0, 3).map((player) => (
            <motion.div
              key={player.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col items-center text-center p-5 rounded-xl ${player.rank === 1
                ? "bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.5)]"
                : player.rank === 2
                  ? "bg-gradient-to-br from-gray-300 to-gray-400 shadow-[0_0_20px_rgba(180,180,180,0.4)]"
                  : "bg-gradient-to-br from-amber-400 to-amber-500 shadow-[0_0_20px_rgba(255,180,50,0.4)]"
                }`}
              style={{ height: player.rank === 1 ? 200 : player.rank === 2 ? 160 : 140 }}
            >
              <div className="text-4xl mb-2">{player.avatar}</div>
              {getRankIcon(player.rank)}
              <h3 className="mt-2 font-semibold text-sm">{player.name}</h3>
              <p className="text-xs text-muted-foreground">{player.title}</p>
              <p className="text-sm font-bold">{player.xp.toLocaleString()} XP</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 🧾 Full Leaderboard List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="space-y-4"
        >
          {leaderboardData.map((player) => (
            <motion.div
              key={player.id}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              className="adventure-card bg-white/70 dark:bg-gray-900/30 p-5 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="font-pixel text-lg text-primary">#{player.rank}</span>
                  <Avatar>
                    <AvatarFallback className="text-2xl">{player.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{player.name}</h3>
                    <p className="text-xs text-muted-foreground">{player.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Star className="w-4 h-4 text-quest-gold" />
                    <span className="font-bold">{player.xp.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">XP</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{player.badges} badges</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 💫 Your Rank & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 p-6 bg-gradient-to-r from-primary/10 to-quest-gold/10 border border-primary/20 rounded-lg text-center"
        >
          <h3 className="font-semibold font-poppins mb-2">Your Progress</h3>
          <div className="flex justify-center space-x-8">
            <p className="text-primary font-bold text-lg">{xp} XP</p>
            <p className="text-magic-purple font-bold text-lg">{badges} Badges</p>
            <p className="text-quest-gold font-bold text-lg">Rank #{rank}</p>
          </div>
        </motion.div>
      </main>

      {/* 🎉 Reward Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="text-6xl font-bold text-yellow-300 mb-4 drop-shadow"
            >
              +XP Gained!
            </motion.h2>
            <p className="text-white text-lg">You’re improving your Java skills ⚡</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Floating emojis */}
      {emojis.map((e) => (
        <FloatingEmoji key={e.id} emoji={e.emoji} />
      ))}
    </motion.div>
  );
};

export default Leaderboard;
