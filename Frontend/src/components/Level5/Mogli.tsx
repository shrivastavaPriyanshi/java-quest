import { motion } from "framer-motion";

interface MogliProps {
    id: number;
    status: "idle" | "running" | "rescuing" | "caught" | "success";
    delay?: number;
}

export const Mogli = ({ id, status, delay = 0 }: MogliProps) => {
    return (
        <motion.div
            className="absolute bottom-20 z-20 text-6xl"
            initial={{ left: "5%" }}
            animate={
                status === "running" ? { left: "60%" } :
                    status === "rescuing" ? { left: "70%", scale: 1.1 } :
                        status === "caught" ? { left: "60%", rotate: [0, -10, 10, -10], scale: 0.9, opacity: 0.8 } :
                            status === "success" ? { left: "90%", y: -20, scale: 1.2 } :
                                { left: "5%" }
            }
            transition={{
                duration: status === "running" ? 2 : 0.5,
                delay: status === "running" ? delay : 0
            }}
        >
            {status === "caught" ? "😱" : "👦🏽"}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/80 text-xs px-2 rounded-full font-bold">
                Thread {id}
            </div>
        </motion.div>
    );
};
