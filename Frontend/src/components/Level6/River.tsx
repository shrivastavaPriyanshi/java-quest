import { motion } from "framer-motion";

export const River = () => {
    return (
        <div className="absolute inset-0 bg-blue-300 overflow-hidden -z-10">
            {/* 🌊 Moving Water Texture */}
            <motion.div
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"
                animate={{ backgroundPositionY: ["0px", "100px"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />

            {/* 🏞️ Banks */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-emerald-600 border-r-8 border-emerald-800" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-emerald-600 border-l-8 border-emerald-800" />

            {/* 🐟 Decor Fish */}
            <motion.div
                className="absolute top-1/4 left-20 text-4xl opacity-50"
                animate={{ x: [-10, 10], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >🐟</motion.div>
        </div>
    );
};
