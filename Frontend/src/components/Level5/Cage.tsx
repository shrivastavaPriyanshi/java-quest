import { motion } from "framer-motion";

interface CageProps {
    isOpen: boolean;
}

export const Cage = ({ isOpen }: CageProps) => {
    return (
        <div className="absolute bottom-20 right-20 z-10 w-40 h-40 bg-zinc-800 border-4 border-zinc-600 rounded-lg flex items-center justify-center shadow-2xl overflow-hidden">

            {/* 🦁 Shere Khan Sleeping Nearby */}
            <div className="absolute -left-32 bottom-0 text-7xl z-20">
                🦁
            </div>

            {/* 🔒 Bars */}
            <motion.div
                className="absolute inset-0 flex justify-between px-2 bg-black/20"
                animate={isOpen ? { y: -150 } : { y: 0 }}
                transition={{ duration: 1 }}
            >
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-full bg-zinc-400 rounded-full" />
                ))}
            </motion.div>

            {/* 🦌 Animals Inside */}
            <div className="flex gap-1 text-3xl">
                <span>🐵</span>
                <span>🦌</span>
                <span>🐻</span>
            </div>
        </div>
    );
};
