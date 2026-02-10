import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DoorProps {
    id: number;
    label: string;
    text: string; // New prop for answer text
    isUnlocked: boolean;
    isHighlighted: boolean;
    status: "idle" | "correct" | "wrong";
    xPosition: number; // percentage (20, 40, 60, 80)
}

export const Door = ({ label, text, isUnlocked, isHighlighted, status, xPosition }: DoorProps) => {
    return (
        <div
            className="absolute bottom-20 flex flex-col items-center"
            style={{ left: `${xPosition}%`, transform: "translateX(-50%)" }}
        >
            {/* 📜 Answer Text (Bubble) - Visible always but emphasized on highlight */}
            <motion.div
                className={cn(
                    "mb-2 px-3 py-2 bg-white/95 rounded-xl shadow-md text-xs font-mono text-center max-w-[140px] border-2 transition-all",
                    isHighlighted ? "border-yellow-400 scale-110 z-20" : "border-transparent opacity-70 grayscale z-10"
                )}
                animate={{ y: isHighlighted ? -5 : 0 }}
            >
                <div className="font-bold text-slate-400 mb-1">{label}</div>
                {text}
            </motion.div>

            {/* 🚪 The Door */}
            <motion.div
                className={cn(
                    "w-24 h-40 border-4 rounded-t-full bg-orange-200 relative flex items-center justify-center text-4xl shadow-xl transition-all",
                    isHighlighted ? "border-yellow-400 shadow-[0_0_30px_gold]" : "border-amber-800",
                    status === "correct" ? "bg-green-300 border-green-500" : "",
                    status === "wrong" ? "bg-red-300 border-red-500" : ""
                )}
                animate={status === "wrong" ? { x: [-5, 5, -5, 5, 0] } : {}}
            >
                {isUnlocked ? "✨" : "🔒"}
            </motion.div>

            {/* ⌨️ Hint */}
            {isHighlighted && !isUnlocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-10 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-mono"
                >
                    Press ENTER
                </motion.div>
            )}
        </div>
    );
};
