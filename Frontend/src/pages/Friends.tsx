import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  UserPlus,
  Sword,
  CheckCircle,
  X,
  Search,
  MessageCircle,
  Trophy,
  Timer,
  Shield,
  Ban,
  Star,
  Bell,
  LinkIcon,
  Zap,
  Gift
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Friend = {
  id: number;
  name: string;
  status: "online" | "ingame" | "offline";
  xp: number;
  lastActive: string;
  giftSent?: boolean;
};

type Activity = {
  id: number;
  user: string;
  action: string;
  time: string;
  icon: string;
};

export default function Friends() {
  const navigate = useNavigate();

  // 🧠 State initialization
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: "Coder Luna 🌙", status: "online", xp: 1450, lastActive: "Now" },
    { id: 2, name: "Java Knight 🛡️", status: "offline", xp: 1200, lastActive: "2h ago" },
  ]);

  const [requests, setRequests] = useState([{ id: 3, name: "Debug Witch 🧙‍♀️" }]);
  const [search, setSearch] = useState("");
  const [allUsers] = useState([
    { id: 10, name: "Algorithm Ace 🤖" },
    { id: 11, name: "Bug Hunter 🐛" },
    { id: 12, name: "Code Wizard 🪄" },
  ]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [openChat, setOpenChat] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [chatText, setChatText] = useState("");
  const [challengeUser, setChallengeUser] = useState<Friend | null>(null);
  const [topic, setTopic] = useState("Java Basics");
  const [difficulty, setDifficulty] = useState("Easy");
  const [profileUser, setProfileUser] = useState<Friend | null>(null);

  const [activities] = useState<Activity[]>([
    { id: 1, user: "Coder Luna 🌙", action: "completed Level 5", time: "2m ago", icon: "🏆" },
    { id: 2, user: "Java Knight 🛡️", action: "earned 'Stream Surfer'", time: "1h ago", icon: "🌊" },
    { id: 3, user: "Debug Witch 🧙‍♀️", action: "joined the game", time: "3h ago", icon: "👋" },
  ]);

  const [notifications, setNotifications] = useState<string[]>([]);

  const notify = (msg: string) => {
    setNotifications((prev) => [...prev, msg]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000);
  };

  // Actions
  const acceptRequest = (id: number) => {
    const user = requests.find((r) => r.id === id);
    if (!user) return;
    setFriends([...friends, { id, name: user.name, status: "online", xp: 900, lastActive: "Now" }]);
    setRequests(requests.filter((r) => r.id !== id));
    notify(`🎉 You are now friends with ${user.name}`);
  };

  const declineRequest = (id: number) => setRequests(requests.filter((r) => r.id !== id));
  const sendRequest = (id: number) => !sentRequests.includes(id) && setSentRequests([...sentRequests, id]);

  const sendMessage = () => {
    if (!chatText.trim()) return;
    setMessages((prev) => [...prev, { user: "You", text: chatText }]);
    setChatText("");
    notify("💬 Message sent");

    if (openChat) {
      setTimeout(() => {
        const replies = ["That's awesome! 🔥", "I'm stuck on Level 4... need help! 😅", "Let's duel later? ⚔️", "Java Streams are so cool! 🌊"];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        setMessages((prev) => [...prev, { user: openChat.name, text: randomReply }]);
      }, 2000);
    }
  };

  const handleGift = (id: number) => {
    setFriends(friends.map(f => f.id === id ? { ...f, giftSent: true } : f));
    notify("🎁 Energy Gift Sent! (+10 XP)");
  };

  const startChallenge = () => {
    const level = Math.floor(Math.random() * 6) + 1;
    navigate(`/level${level}?mode=duel&opponent=${challengeUser?.name}`);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText("Join me on Java Quest! 🧙‍♂️ https://javaquest.example.com");
    notify("✅ Invite link copied!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Header />

      <main className="container py-8 max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-xl"><UserPlus size={32} /></span>
            Social Hub
          </h1>
          <p className="text-slate-500 mt-2">Connect, Compete, and Collaborate with fellow adventurers.</p>
        </header>

        {/* 🔔 Notifications Layer */}
        <div className="fixed top-20 right-4 space-y-2 z-[9999]">
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div
                key={i}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3"
              >
                <Bell className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{n}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 👈 LEFT COL: Friends & Management (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">

            {/* 🔍 Search Section */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Search className="text-slate-400" /> Find Friends
              </h2>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="Search by username or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              </div>

              {/* Search Results */}
              {search && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid gap-3">
                  {allUsers
                    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
                    .map((u) => (
                      <div key={u.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                        <span className="font-semibold">{u.name}</span>
                        {sentRequests.includes(u.id) ? (
                          <span className="text-sm text-green-500 font-medium bg-green-100 px-3 py-1 rounded-full">Request Sent</span>
                        ) : (
                          <Button size="sm" onClick={() => sendRequest(u.id)} className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="mr-2 w-4" /> Add Friend
                          </Button>
                        )}
                      </div>
                    ))}
                  {allUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <div className="text-center text-slate-400 py-4">No adventurers found...</div>
                  )}
                </motion.div>
              )}
            </section>

            {/* 🤝 Friend Requests */}
            {requests.length > 0 && (
              <section className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-900">
                <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <Bell className="text-blue-500" /> Pending Requests
                </h2>
                <div className="grid gap-3">
                  {requests.map((r) => (
                    <div key={r.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {r.name[0]}
                        </div>
                        <span className="font-bold text-lg">{r.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => acceptRequest(r.id)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="mr-1 w-4" /> Accept
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => declineRequest(r.id)} className="text-red-500 hover:bg-red-50">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 👯 Friends List */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" /> Your Friends ({friends.length})
              </h2>
              <div className="grid gap-4">
                {friends.map((f) => (
                  <motion.div
                    key={f.id}
                    layout
                    className="group bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setProfileUser(f)}>
                      <div className="relative">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl">
                          {f.name.split(' ')[0][0]}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${f.status === "online" ? "bg-green-500" : f.status === "ingame" ? "bg-yellow-500" : "bg-slate-400"
                          }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{f.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> {f.xp} XP</span>
                          <span>•</span>
                          <span>{f.status === "online" ? "Online" : `Active ${f.lastActive}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant={f.giftSent ? "outline" : "default"}
                        className={f.giftSent ? "text-slate-400" : "bg-pink-500 hover:bg-pink-600 text-white"}
                        onClick={() => !f.giftSent && handleGift(f.id)}
                        disabled={f.giftSent}
                      >
                        <Gift className="w-4 h-4 mr-1" /> {f.giftSent ? "Sent" : "Gift"}
                      </Button>
                      <Button size="icon" variant="secondary" onClick={() => setOpenChat(f)}>
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button size="icon" variant="outline" className="border-red-200 hover:bg-red-50" onClick={() => setChallengeUser(f)}>
                        <Sword className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* 👉 RIGHT COL: Activity & Social Actions (1/3 width) */}
          <div className="space-y-8">

            {/* 📰 Activity Feed */}
            <section className="bg-slate-900 text-slate-100 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />

              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                <Zap className="text-yellow-400 fill-yellow-400" /> Live Feed
              </h2>

              <div className="space-y-6 relative z-10">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-4">
                    <div className="text-2xl bg-slate-800 p-2 rounded-xl h-fit">{act.icon}</div>
                    <div>
                      <div className="text-sm">
                        <span className="font-bold text-white">{act.user}</span> <span className="text-slate-300">{act.action}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 📨 Invite Card */}
            <section className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-lg">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <UserPlus size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
              <p className="text-purple-100 mb-6 text-sm">Grow your squad and earn 500 XP for every friend who joins!</p>
              <Button onClick={copyInvite} variant="secondary" className="w-full bg-white text-purple-600 hover:bg-purple-50 font-bold">
                <LinkIcon className="w-4 h-4 mr-2" /> Copy Invite Link
              </Button>
            </section>

          </div>
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {/* Profile Modal */}
        {profileUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setProfileUser(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
                {profileUser.name[0]}
              </div>
              <h2 className="text-2xl font-bold mb-1">{profileUser.name}</h2>
              <p className="text-slate-500 mb-6 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" /> {profileUser.status}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-600">{profileUser.xp}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">XP Earned</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-yellow-500">5</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Badges</div>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-100"><Ban className="w-4 h-4 mr-2" /> Block</Button>
                <Button onClick={() => setProfileUser(null)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Chat Modal - Super Sized 🚀 */}
        {openChat && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setOpenChat(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                      {openChat.name[0]}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${openChat.status === "online" ? "bg-green-500" : "bg-slate-400"
                      }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{openChat.name}</h3>
                    <p className="text-slate-500 text-sm">{openChat.status === "online" ? "Online Now" : `Last seen ${openChat.lastActive}`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setChallengeUser(openChat)}>
                    <Sword className="w-4 h-4 mr-2" /> Duel
                  </Button>
                  <button onClick={() => setOpenChat(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} className="text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-100 dark:bg-slate-950/50">
                {messages.length === 0 && (
                  <div className="text-center text-slate-400 mt-20">
                    <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Start the conversation with {openChat.name}!</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${m.user === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] p-5 rounded-3xl text-base shadow-sm ${m.user === "You"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700"
                      }`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-4 items-center">
                <input
                  className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                  placeholder={`Message ${openChat.name}...`}
                  value={chatText}
                  onChange={e => setChatText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  autoFocus
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-transform shadow-lg"
                >
                  <Zap size={24} />
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Challenge Modal */}
        {challengeUser && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

              <Sword className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Duel Pending</h2>
              <p className="text-slate-500 mb-8">Challenging <span className="font-bold text-slate-800 dark:text-slate-100">{challengeUser.name}</span></p>

              <div className="space-y-4 mb-8 text-left">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topic</label>
                  <select className="w-full mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl" value={topic} onChange={e => setTopic(e.target.value)}>
                    <option>Java Streams</option>
                    <option>OOP Concepts</option>
                    <option>Exception Handling</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Difficulty</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mt-1">
                    {["Easy", "Medium", "Hard"].map(d => (
                      <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${difficulty === d ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 py-6 text-lg" onClick={() => setChallengeUser(null)}>Retreat</Button>
                <Button className="flex-1 py-6 text-lg bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" onClick={startChallenge}>
                  FIGHT! ⚔️
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
