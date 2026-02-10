import { motion } from "framer-motion";

interface PlayerProps {
    x: number; // 0 to 100 percentage
    direction: "left" | "right";
    isWalking: boolean;
}

export const Player = ({ x, direction, isWalking }: PlayerProps) => {
    return (
        <motion.div
            className="absolute bottom-20 text-6xl z-20 pointer-events-none"
            animate={{
                left: `${x}%`,
                scaleX: direction === "left" ? -1 : 1, // Flip sprite
                y: isWalking ? [0, -5, 0] : 0 // Bounce when walking
            }}
            transition={{
                left: { type: "tween", ease: "linear", duration: 0.1 },
                y: { repeat: Infinity, duration: 0.3 }
            }}
        >
            🧙‍♂️
        </motion.div>
    );
};
