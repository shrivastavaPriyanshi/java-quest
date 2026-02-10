import { motion } from "framer-motion";

interface WorkerMonkeyProps {
    id: number;
    status: "waiting" | "crossing" | "falling" | "success";
    position: "left" | "right";
}

export const WorkerMonkey = ({ id, status, position }: WorkerMonkeyProps) => {
    return (
        <motion.div
            layoutId={`monkey-${id}`}
            className="absolute top-1/2 -translate-y-1/2 text-6xl z-10"
            initial={{
                x: position === "left" ? "10vw" : "80vw",
                y: 0
            }}
            animate={
                status === "crossing"
                    ? { x: "50vw", rotate: 0 } // Move to center
                    : status === "falling"
                        ? { y: 200, rotate: 180, opacity: 0 } // Fall into river
                        : status === "success"
                            ? { x: position === "left" ? "80vw" : "10vw", y: -20, scale: 1.2 }
                            : {}
            }
            transition={{ duration: status === "crossing" ? 2 : 0.5 }}
        >
            🐵
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 rounded-full font-mono">
                T-{id}
            </div>
        </motion.div>
    );
};
