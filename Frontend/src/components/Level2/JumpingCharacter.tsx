import { motion } from "framer-motion";

interface JumpingCharacterProps {
    branchIndex: number; // 0 (ground) to N
    status: "idle" | "jumping" | "falling";
    align: "left" | "right"; // Current branch alignment
}

export const JumpingCharacter = ({ branchIndex, status, align }: JumpingCharacterProps) => {
    return (
        <motion.div
            className="absolute text-6xl z-20 transition-all duration-500 ease-in-out"
            style={{
                bottom: `${branchIndex * 160 + 50}px`, // 160px per branch height + offset
                left: align === "left" ? "20%" : "70%", // Position based on branch side
            }}
            animate={
                status === "jumping"
                    ? { y: [0, -100, 0], scale: [1, 1.2, 1] }
                    : status === "falling"
                        ? { y: [0, 50, 150], rotate: [0, 20, 90], opacity: [1, 1, 0] }
                        : { y: [0, -5, 0] } // Idle breathing
            }
            transition={{
                type: "spring",
                stiffness: 70,
                y: { duration: status === "jumping" ? 0.6 : 1 }
            }}
        >
            {status === "falling" ? "🙀" : "🐒"}
        </motion.div>
    );
};
