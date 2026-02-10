import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Sword, Trophy, User, Users, LogOut, Settings, Share2, TerminalSquare, Book, Sprout, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Flame } from "lucide-react";
import { useEffect } from "react";

interface HeaderProps {
  fluid?: boolean;
}

export const Header = ({ fluid = false }: HeaderProps) => {
  // Initialize state based on actual DOM or localStorage
  const [isDark, setIsDark] = useState(() => {
    // Check if dark class is present or saved preference
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Sync React state with DOM on mount
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check Streak Logic
    const lastLoginDate = localStorage.getItem("lastLoginDate");
    const currentStreak = parseInt(localStorage.getItem("streak") || "0");
    const today = new Date().toDateString();

    if (lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLoginDate === yesterday.toDateString()) {
        // Streak continues
        const newStreak = currentStreak + 1;
        setStreak(newStreak);
        localStorage.setItem("streak", newStreak.toString());
      } else {
        // Streak broken (or first time)
        setStreak(1);
        localStorage.setItem("streak", "1");
      }
      localStorage.setItem("lastLoginDate", today);
    } else {
      // Already logged in today
      setStreak(currentStreak);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleShareProfile = () => {
    const shareText = "Check out my Java Quest profile! 🚀";
    const shareUrl = "https://javaquest.example.com/profile";
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    alert("✅ Profile link copied to clipboard!");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
    >
      <div className={`${fluid ? "w-full px-6" : "container"} flex h-16 items-center justify-between`}>
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-gradient-to-br from-primary to-quest-gold rounded-lg flex items-center justify-center"
          >
            <Sword className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-pixel text-sm text-primary">Java Quest</span>
            <span className="text-xs text-muted-foreground font-poppins">Master the Code</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/leaderboard">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Trophy className="w-5 h-5" />
              <span className="text-base font-medium">Leaderboard</span>
            </Button>
          </Link>
          <Link to="/friends">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Users className="w-5 h-5" />
              <span className="text-base font-medium">Friends</span>
            </Button>
          </Link>
          <Link to="/playground">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <TerminalSquare className="w-5 h-5" />
              <span className="text-base font-medium">Playground</span>
            </Button>
          </Link>
          <Link to="/notes">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Book className="w-5 h-5" />
              <span className="text-base font-medium">Notes</span>
            </Button>
          </Link>
          <Link to="/skills">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Sprout className="w-5 h-5" />
              <span className="text-base font-medium">Skill Tree</span>
            </Button>
          </Link>
          <Link to="/badges">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Award className="w-5 h-5" />
              <span className="text-base font-medium">Badges</span>
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <span className="text-base font-medium">About</span>
            </Button>
          </Link>
        </nav>

        {/* Theme Toggle + Profile */}
        <div className="flex items-center space-x-4">
          {/* Light/Dark Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-yellow-500" />
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
            <Moon className="w-4 h-4 text-blue-400" />
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-primary/40 hover:border-primary transition-all">
                <AvatarImage src="https://api.dicebear.com/7.x/pixel-art/svg?seed=player" alt="Profile" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 shadow-lg border border-border bg-background/95">
              <DropdownMenuItem onClick={() => navigate("/profile")} className="flex items-center space-x-2 cursor-pointer">
                <User className="w-4 h-4 text-primary" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="flex items-center space-x-2 cursor-pointer">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareProfile} className="flex items-center space-x-2 cursor-pointer">
                <Share2 className="w-4 h-4 text-quest-gold" />
                <span>Share Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer text-red-500">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
