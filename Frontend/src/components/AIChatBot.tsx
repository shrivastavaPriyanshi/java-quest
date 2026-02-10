import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

const FAQ_DATA = [
    // 🎮 Game Mechanics
    { q: "How do I earn XP?", a: "You earn XP by completing levels, winning duels, and maintaining your daily streak! 🌟" },
    { q: "What is a Duel?", a: "A Duel is a real-time battle where you challenge a friend to answer Java questions. The winner gets XP! ⚔️" },
    { q: "I'm stuck on Level 4!", a: "Level 4 is the Boss Battle. Remember to use the correct syntax to attack the monster. Hint: Check your semicolons! " },
    { q: "How do I add friends?", a: "Go to the Friends page, use the search bar to find their username, and click 'Add'. 🤝" },
    { q: "What are badges?", a: "Badges are awards for specific achievements, like 'Stream Surfer' for mastering Level 6 or 'Bug Hunter' for perfect streaks. 🏆" },
    { q: "How do I save progress?", a: "Your progress is automatically saved to the cloud after every level completion. No manual save needed! ☁️" },

    // ☕ Java Basics
    { q: "What is Java?", a: "Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. ☕" },
    { q: "What is a variable?", a: "A variable is a container for storing data values. In Java, you need to declare the type, like `int x = 5;`. 📦" },
    { q: "What is a loop?", a: "Loops are used to execute a block of code repeatedly. Java has `for`, `while`, and `do-while` loops. 🔄" },
    { q: "What is an array?", a: "An array is a container object that holds a fixed number of values of a single type. Example: `int[] numbers = {1, 2, 3};`. 📚" },
    { q: "What is a method?", a: "A method is a block of code which only runs when it is called. You can pass data, known as parameters, into a method. 🛠️" },

    // 🏗️ OOP Concepts
    { q: "What is OOP?", a: "OOP stands for Object-Oriented Programming. It relies on the concept of classes and objects. The 4 pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction. 🏗️" },
    { q: "What is a Class?", a: "A class is a blueprint for creating objects. It defines the properties (fields) and behaviors (methods) that the objects will have. 📝" },
    { q: "What is an Object?", a: "An object is an instance of a class. If `Car` is a class, then `myToyota` is an object. 🚗" },
    { q: "What is Inheritance?", a: "Inheritance is a mechanism where one class acquires the properties and behaviors of a parent class. usage: `class Dog extends Animal`. 🧬" },
    { q: "What is Polymorphism?", a: "Polymorphism means 'many forms'. It allows us to perform a single action in different ways, typically via method overriding or overloading. 🎭" },
    { q: "What is Encapsulation?", a: "Encapsulation is bundling the data (variables) and the methods that operate on the data into a single unit (class), often hiding internal details. 💊" },

    // 🌊 Advanced Java
    { q: "What are Streams?", a: "Java Streams (introduced in Java 8) allow you to process sequences of elements primarily from collections using functional operations like `filter`, `map`, and `reduce`. 🌊" },
    { q: "What is a Thread?", a: "A thread is a lightweight sub-process, the smallest unit of processing. Multithreading allows concurrent execution of two or more parts of a program. 🧵" },
    { q: "What is a Lambda?", a: "A Lambda expression is a short block of code which takes in parameters and returns a value. It's often used to implement functional interfaces. `(x) -> x + 1`. 🐑" },
    { q: "What is an Exception?", a: "An exception is an event, which occurs during the execution of a program, that disrupts the normal flow of the program's instructions. `try-catch` blocks handle them. ⚠️" },
    { q: "HashMap vs HashSet", a: "HashMap stores key-value pairs (K, V), while HashSet stores only unique values. HashMap allows duplicate values, HashSet doesn't allow duplicate elements. 🗺️" },

    // 🐛 Debugging Tips
    { q: "NullPointerException", a: "This happens when you try to use a reference that points to `null` (no object). Check if your object is initialized before using it! 🚫" },
    { q: "Infinite Loop", a: "If your game freezes, you might have an infinite loop! Check your `while` or `for` conditions to ensure they eventually become false. ♾️" },
    { q: "Syntax Error", a: "Red wavy lines? You might be missing a semicolon `;`, a bracket `}`, or spelled a keyword wrong. Java is strict! 📏" },
];

export const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm your AI Guide. Stuck? Ask me anything about Java Quest! 🧙‍♂️", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simulate AI Response
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = "I'm still learning! Try asking about 'Java', 'Streams', 'Levels', or specific errors like 'NullPointer'. 🤔";

            // 1. Direct Keyword Matching (Priority)
            const match = FAQ_DATA.find(faq => {
                const keywords = faq.q.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ");
                // If input contains significant keywords from the question
                const significantWords = keywords.filter(w => w.length > 2 && !["what", "how", "the", "and"].includes(w));
                return significantWords.some(word => lowerInput.includes(word));
            });

            if (match) {
                response = match.a;
            } else {
                // 2. Fallback conversational matching
                if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                    response = "Hello adventurer! Ready to solve some coding mysteries? 🚀";
                } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
                    response = "Happy coding! Come back soon! 👋";
                } else if (lowerInput.includes("thank")) {
                    response = "You're welcome! Keep leveling up! ⭐";
                } else if (lowerInput.includes("bug") || lowerInput.includes("error") || lowerInput.includes("stuck")) {
                    response = "Stuck? Try checking your console (F12) for error messages, or ask me about 'Exceptions' or 'Syntax'. 🐛";
                } else if (lowerInput.includes("level")) {
                    response = "Which level? I can help with Level 1 (Village), Level 2 (Forest), Level 3 (Desert), Level 4 (Boss), Level 5 (Threads), or Level 6 (Streams).";
                }
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, text: response, sender: "bot" }]);
        }, 800);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-96 sm:w-[450px] overflow-hidden flex flex-col h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2.5 rounded-full">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">AI Guide</h3>
                                    <p className="text-xs text-violet-200 flex items-center gap-1"><Sparkles size={10} /> Always Online</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="hover:bg-white/20 text-white rounded-full h-10 w-10">
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] p-4 text-sm rounded-2xl ${m.sender === "user"
                                            ? "bg-violet-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 rounded-bl-none text-slate-700 dark:text-slate-200"
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Chips */}
                        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/50 flex gap-2 overflow-x-auto no-scrollbar">
                            {["XP System", "Level 4", "Friends"].map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => setInput(`Tell me about ${chip}`)}
                                    className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full whitespace-nowrap hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 font-medium"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                            <input
                                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="Ask for help..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <Button size="icon" onClick={handleSend} className="rounded-full h-11 w-11 bg-violet-600 hover:bg-violet-700">
                                <Send size={18} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5 rounded-full shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all"
            >
                {isOpen ? <X size={32} /> : <Bot size={32} />}
            </motion.button>
        </div>
    );
};
