import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Play, TerminalSquare, RotateCcw, CheckCircle2, AlertCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";

// --- Types ---
type Problem = {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    starterCode: string;
    solutionCode: string;
    explanation: string;
    examples: { input: string; output: string }[];
};

// --- Mock Data: LeetCode Style Questions (Java) ---
const PROBLEMS: Problem[] = [
    {
        id: 1,
        title: "Sum of Two Numbers",
        difficulty: "Easy",
        description: "Write a function that takes two integers as input and returns their sum.",
        starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println(sum(5, 7)); // Should print 12
        System.out.println(sum(10, -3)); // Should print 7
    }

    public static int sum(int a, int b) {
        // Write your code here
        return 0; 
    }
}`,
        solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println(sum(5, 7)); 
        System.out.println(sum(10, -3)); 
    }

    public static int sum(int a, int b) {
        return a + b; 
    }
}`,
        explanation: `### Line-by-Line Explanation:
1. **public static int sum(int a, int b)**: Defines a function named 'sum' that takes two integers.
2. **return a + b;**: The core logic! It adds 'a' and 'b' together and returns the result.
3. **main method**: Calls our sum function with test values to verify it works.`,
        examples: [
            { input: "a = 5, b = 7", output: "12" },
            { input: "a = 10, b = -3", output: "7" }
        ]
    },
    {
        id: 2,
        title: "Reverse a String",
        difficulty: "Medium",
        description: "Write a function that reverses a given string. Do not use StringBuilder.reverse()!",
        starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println(reverse("Hello")); // Should print olleH
        System.out.println(reverse("Java"));  // Should print avaJ
    }

    public static String reverse(String s) {
        // Write your code here
        return "";
    }
}`,
        solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println(reverse("Hello"));
    }

    public static String reverse(String s) {
        String reversed = "";
        for (int i = s.length() - 1; i >= 0; i--) {
            reversed += s.charAt(i);
        }
        return reversed;
    }
}`,
        explanation: `### Line-by-Line Explanation:
1. **String reversed = "";**: Initialize an empty string to hold our result.
2. **for (int i = s.length() - 1; i >= 0; i--)**: Start a loop from the *last* character of the string down to the first (index 0).
3. **reversed += s.charAt(i);**: Append the current character to our 'reversed' string.
4. **return reversed;**: Send back the fully reversed string.`,
        examples: [
            { input: "'Hello'", output: "'olleH'" },
            { input: "'Java'", output: "'avaJ'" }
        ]
    },
    {
        id: 3,
        title: "Factorial",
        difficulty: "Easy",
        description: "Write a recursive function to calculate the factorial of a non-negative integer n.",
        starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println(factorial(5)); // Should print 120
    }

    public static int factorial(int n) {
        // Write your code here
        return 0;
    }
}`,
        solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println(factorial(5));
    }

    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
        explanation: `### Line-by-Line Explanation:
1. **Base Case**: 'if (n <= 1) return 1;' checks if we've reached 1 or 0. Factorial of 0 or 1 is alway 1. This stops the recursion.
2. **Recursive Step**: 'return n * factorial(n - 1);' calls the function itself with a smaller number (n-1).
3. **Example**: factorial(5) becomes 5 * factorial(4), which becomes 5 * 4 * factorial(3)... until it hits 1.`,
        examples: [
            { input: "n = 5", output: "120" },
            { input: "n = 0", output: "1" }
        ]
    }
];

export default function Playground() {
    const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0]);
    const [code, setCode] = useState(PROBLEMS[0].starterCode);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // null = not run, true = success, false = error
    const [showExplanation, setShowExplanation] = useState(false);

    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
        }
        return true;
    });

    // Sync with Global Theme via MutationObserver
    // (Copied from ProgressMap logic for consistency)
    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
        };
        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    // Piston API: Execute Java Code
    const runCode = async () => {
        setIsRunning(true);
        setOutput("Running...\n");
        setIsSuccess(null);

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: "java",
                    version: "15.0.2",
                    files: [{ name: "Main.java", content: code }],
                }),
            });

            const data = await response.json();

            if (data.run) {
                const result = data.run.stdout || data.run.stderr;
                setOutput(result);

                // Simple heuristic for success check (if no stderr and non-empty stdout)
                if (!data.run.stderr && data.run.stdout.trim().length > 0) {
                    setIsSuccess(true);
                    toast.success("Code Executed Successfully! 🚀");
                } else {
                    setIsSuccess(false);
                    if (data.run.stderr) toast.error("Compilation/Runtime Error ❌");
                }
            } else {
                setOutput("Error: Failed to execute code.");
                setIsSuccess(false);
            }
        } catch (error) {
            setOutput("Error: Could not connect to execution server.");
            setIsSuccess(false);
            toast.error("Network Error 🌐");
        } finally {
            setIsRunning(false);
        }
    };

    const handleProblemChange = (problem: Problem) => {
        setSelectedProblem(problem);
        setCode(problem.starterCode);
        setOutput("");
        setIsSuccess(null);
        setShowExplanation(false);
    };

    // Check if mounted to avoid hydration mismatch if using next-themes differently
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // Avoid render before theme is determined

    return (
        <div className="h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <Header fluid={true} />

            <main className="flex-1 flex overflow-hidden">
                <ResizablePanelGroup direction="horizontal">

                    {/* --- LEFT PANEL: Problem Description --- */}
                    <ResizablePanel defaultSize={40} minSize={30} className="bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col">
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                            {/* Problem Selector */}
                            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                                {PROBLEMS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleProblemChange(p)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                            ${selectedProblem.id === p.id
                                                ? "bg-primary text-white border-primary"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent"}
                        `}
                                    >
                                        {p.id}. {p.title}
                                    </button>
                                ))}
                            </div>

                            <h1 className="text-3xl font-bold mb-2 text-primary">{selectedProblem.id}. {selectedProblem.title}</h1>

                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 border
                ${selectedProblem.difficulty === "Easy" ? "bg-green-100 text-green-700 border-green-200" :
                                    selectedProblem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                                        "bg-red-100 text-red-700 border-red-200"}
              `}>
                                {selectedProblem.difficulty}
                            </div>

                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{selectedProblem.description}</p>
                            </div>

                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Examples</h3>
                                {selectedProblem.examples.map((ex, i) => (
                                    <div key={i} className="mb-3 last:mb-0 text-sm font-mono">
                                        <div className="flex gap-2 mb-1">
                                            <span className="text-slate-400">Input:</span>
                                            <span className="text-slate-800 dark:text-slate-200">{ex.input}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-slate-400">Output:</span>
                                            <span className="text-slate-800 dark:text-slate-200 font-bold">{ex.output}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- Explanation Section --- */}
                            <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setShowExplanation(!showExplanation)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-slate-200">Solution & Explanation</div>
                                            <div className="text-xs text-slate-500">Stuck? Reveal the answer line-by-line</div>
                                        </div>
                                    </div>
                                    {showExplanation ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>

                                {showExplanation && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                                    >
                                        <div className="p-4">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Solution Code</h4>
                                            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-4 bg-[#1e1e1e]">
                                                <Editor
                                                    height="200px"
                                                    defaultLanguage="java"
                                                    theme="vs-dark"
                                                    value={selectedProblem.solutionCode}
                                                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                                                />
                                            </div>

                                            <div className="prose dark:prose-invert prose-sm max-w-none">
                                                <div dangerouslySetInnerHTML={{
                                                    // Simple markdown parsing for bold/newlines
                                                    __html: selectedProblem.explanation
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        .replace(/\n/g, '<br/>')
                                                }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="w-1 bg-slate-200 dark:bg-slate-700 hover:bg-primary transition-colors" />

                    {/* --- RIGHT PANEL: Code Editor & Output --- */}
                    <ResizablePanel defaultSize={60} minSize={30} className="flex flex-col bg-slate-900">

                        {/* Editor Toolbar */}
                        <div className="bg-slate-800 border-b border-slate-700 p-2 flex justify-between items-center">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-xs font-mono text-slate-400">Main.java</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setCode(selectedProblem.starterCode)}
                                    className="text-slate-400 hover:text-white"
                                    title="Reset Code"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2"
                                    onClick={runCode}
                                    disabled={isRunning}
                                >
                                    {isRunning ? "Running..." : <><Play className="w-4 h-4" /> Run Code</>}
                                </Button>
                            </div>
                        </div>

                        {/* Code Editor (Monaco) */}
                        <div className="flex-1 relative font-mono text-sm overflow-hidden">
                            <Editor
                                height="100%"
                                defaultLanguage="java"
                                language="java"
                                theme={isDarkMode ? "vs-dark" : "light"}
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 16, // Increased as requested
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 16, bottom: 16 },
                                    fontFamily: "'Fira Code', 'Consolas', monospace",
                                }}
                            />
                        </div>

                        {/* Output Panel */}
                        <div className="h-1/3 bg-[#1e1e1e] border-t border-slate-700 flex flex-col">
                            <div className="bg-slate-800/50 p-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                <span className="flex items-center gap-2"><TerminalSquare className="w-4 h-4" /> Output/Console</span>
                                {isSuccess === true && <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Success</span>}
                                {isSuccess === false && <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Error</span>}
                            </div>
                            <pre className="flex-1 p-4 overflow-auto font-mono text-sm text-slate-300 custom-scrollbar whitespace-pre-wrap">
                                {output || <span className="text-slate-600 italic">// Run your code to see output here...</span>}
                            </pre>
                        </div>

                    </ResizablePanel>

                </ResizablePanelGroup>
            </main>
        </div>
    );
}
