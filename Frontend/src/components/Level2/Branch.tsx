import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BranchProps {
    question: string;
    options: string[];
    onSelect: (option: string) => void;
    isActive: boolean;
    align: "left" | "right";
    disabled: boolean;
}

export const Branch = ({ question, options, onSelect, isActive, align, disabled }: BranchProps) => {
    return (
        <div className={`relative flex flex-col ${align === "left" ? "items-start" : "items-end"} mb-32 w-full px-8`}>

            {/* 🪵 The Branch Logic */}
            <div
                className={`h-4 bg-amber-800 rounded-full relative ${align === "left" ? "w-2/3 rounded-l-none" : "w-2/3 rounded-r-none"
                    }`}
            >
                {/* 🌿 Leaves decoration */}
                <div className="absolute -top-6 left-10 text-4xl">🌿</div>
                <div className="absolute -top-4 right-20 text-3xl">🍃</div>
            </div>

            {/* ❓ Question Box (hanging from branch) */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.6 }}
                className={`mt-4 bg-white/90 p-4 rounded-xl shadow-lg max-w-sm border-2 ${isActive ? "border-green-500" : "border-amber-700/30"}`}
            >
                <p className="font-bold text-slate-800 mb-3">{question}</p>

                <div className="grid grid-cols-1 gap-2">
                    {options.map((opt) => (
                        <Button
                            key={opt}
                            onClick={() => onSelect(opt)}
                            disabled={disabled}
                            variant="outline"
                            className="justify-start text-left h-auto py-2 hover:bg-green-100 hover:text-green-800 transition-colors"
                        >
                            🍃 {opt}
                        </Button>
                    ))}
                </div>
            </motion.div>

        </div>
    );
};
