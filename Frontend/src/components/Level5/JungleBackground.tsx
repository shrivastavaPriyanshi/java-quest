import { motion } from "framer-motion";

export const JungleBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden bg-[#1e4d2b] -z-10">
            {/* 🌳 Trees */}
            <img src="https://cdn-icons-png.flaticon.com/512/4525/4525876.png" className="absolute top-10 left-[-50px] w-64 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/512/4525/4525876.png" className="absolute top-20 right-[-30px] w-80 opacity-60 scale-x-[-1]" />

            {/* 🌊 Animated River */}
            <div className="absolute top-1/2 left-0 w-full h-32 bg-blue-500/50 backdrop-blur-sm flex items-center overflow-hidden border-y-4 border-blue-700">
                <motion.div
                    className="flex gap-20"
                    animate={{ x: [-100, -200] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-20 h-2 bg-blue-300/50 rounded-full" />
                    ))}
                </motion.div>
            </div>

            {/* 🪵 Bridge (The Shared Resource) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-800 border-x-8 border-amber-950 shadow-2xl flex items-center justify-center z-0">
                <div className="text-white/30 font-bold text-center">SHARED <br /> RESOURCE</div>
            </div>
        </div>
    );
};
