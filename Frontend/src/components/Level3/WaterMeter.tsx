import { motion } from "framer-motion";

interface WaterMeterProps {
    water: number; // 0 to 100
}

export const WaterMeter = ({ water }: WaterMeterProps) => {
    return (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-3 bg-white/80 p-3 rounded-full shadow-lg border-2 border-amber-500">
            <div className="text-3xl">💧</div>

            <div className="relative w-40 h-6 bg-slate-200 rounded-full overflow-hidden border border-slate-400">
                {/* Fill */}
                <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: "100%" }}
                    animate={{
                        width: `${water}%`,
                        backgroundColor: water < 20 ? "#ef4444" : "#3b82f6" // Red if low
                    }}
                    transition={{ type: "tween", ease: "linear", duration: 0.5 }}
                />

                {/* Bubbles */}
                <motion.div
                    className="absolute top-0 bottom-0 right-2 w-2 bg-white/30 rounded-full"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            <div className={`font-bold font-mono text-lg ${water < 20 ? "text-red-500 animate-pulse" : "text-blue-600"}`}>
                {Math.round(water)}%
            </div>
        </div>
    );
};
