import { motion } from "framer-motion";

interface BoatProps {
    lane: number; // 0, 1, 2
}

export const Boat = ({ lane }: BoatProps) => {
    // Lane positions: Left (25%), Center (50%), Right (75%)
    const positions = ["25%", "50%", "75%"];

    return (
        <motion.div
            className="absolute bottom-20 text-6xl z-20"
            initial={{ left: "50%" }}
            animate={{ left: positions[lane], x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            🚣
        </motion.div>
    );
};
