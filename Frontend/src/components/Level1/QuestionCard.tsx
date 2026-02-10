import { motion } from "framer-motion";

interface QuestionCardProps {
    question: string;
    options: { id: number; text: string; label: string }[];
    currentQ: number;
    totalQ: number;
}

export const QuestionCard = ({ question, options, currentQ, totalQ }: QuestionCardProps) => {
    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={currentQ} // Re-animate on new question
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/95 p-6 rounded-xl shadow-2xl max-w-2xl text-center z-30 border-2 border-slate-200"
        >
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Question {currentQ + 1} / {totalQ}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {options.map((opt) => (
                    <div key={opt.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <span className="font-bold text-lg bg-slate-200 w-8 h-8 flex items-center justify-center rounded-full text-slate-600">
                            {opt.label}
                        </span>
                        <span className="font-mono text-sm text-slate-700">{opt.text}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
