import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProgressMap from "./pages/ProgressMap";
import Playground from "./pages/Playground";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Level4 from "./pages/Level4";
import Level5 from "./pages/Level5";
import Level6 from "./pages/Level6";
import Friends from "./pages/Friends";
import { Notes } from "./pages/Notes";
import { SkillTree } from "./pages/SkillTree";
import { DailyChallenge } from "./pages/DailyChallenge";
import { Badges } from "./pages/Badges";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";


const queryClient = new QueryClient();

// ✅ This small wrapper allows AnimatePresence to detect route changes
const AnimatedRoutes = () => {
  const location = useLocation();

  // optional: Scroll to top on every page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<ProgressMap />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/about" element={<About />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level2" element={<Level2 />} />
        <Route path="/level3" element={<Level3 />} />
        <Route path="/level4" element={<Level4 />} />
        <Route path="/level5" element={<Level5 />} />
        <Route path="/level6" element={<Level6 />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/skills" element={<SkillTree />} />
        <Route path="/daily-bug-hunt" element={<DailyChallenge />} />
        <Route path="/badges" element={<Badges />} />




      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Wrap routes in AnimatePresence */}
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
