import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronRight, FileText, Search, Download, Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SYLLABUS, Module, Topic } from "@/data/syllabus";
import { Header } from "@/components/Layout/Header";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const Notes = () => {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(SYLLABUS[0].topics[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleDownload = () => {
        toast.success("Downloading PDF...", {
            description: `Starting download for ${selectedTopic?.title}.pdf`
        });
        // Mock download delay
        setTimeout(() => {
            toast.dismiss();
            toast.success("Download Complete", {
                description: `${selectedTopic?.title}.pdf has been saved.`
            });
        }, 2000);
    };

    // Filter logic would go here, simplified for now to just render structure
    const filteredModules = SYLLABUS;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col">
            <Header fluid={true} />

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Sidebar Toggle */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <Button variant="outline" size="icon" onClick={toggleSidebar}>
                        <Menu size={20} />
                    </Button>
                </div>

                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col absolute md:relative z-40 h-full shadow-xl md:shadow-none"
                        >
                            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 text-sm font-medium transition-colors">
                                    <ArrowLeft size={16} /> Back to Home
                                </Link>
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                                    <Book className="text-violet-600 dark:text-violet-400" />
                                    Knowledge Hub
                                </h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <Input
                                        placeholder="Search topics..."
                                        className="pl-9 bg-slate-100 dark:bg-slate-800 border-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-6">
                                    {filteredModules.map((module) => (
                                        <div key={module.id} className="space-y-2">
                                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
                                                {module.title}
                                            </h3>
                                            <div className="space-y-1">
                                                {module.topics.map((topic) => (
                                                    <button
                                                        key={topic.id}
                                                        onClick={() => {
                                                            setSelectedTopic(topic);
                                                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
                                                            ${selectedTopic?.id === topic.id
                                                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"}
                                                        `}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <FileText size={16} className={selectedTopic?.id === topic.id ? "fill-violet-600/20" : ""} />
                                                            {topic.title}
                                                        </span>
                                                        {selectedTopic?.id === topic.id && <ChevronRight size={14} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10 lg:p-16 w-full">
                    <div className="max-w-4xl mx-auto">
                        {selectedTopic ? (
                            <motion.div
                                key={selectedTopic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{selectedTopic.title}</h1>
                                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <Book size={16} /> Java Tales Syllabus
                                        </p>
                                    </div>
                                    <Button onClick={handleDownload} className="gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                                        <Download size={18} />
                                        Download PDF
                                    </Button>
                                </div>

                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    {/* Simple Markdown Rendering (Replace with a real markdown renderer if needed) */}
                                    {selectedTopic.content.split('\n').map((line, idx) => {
                                        if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('- ')) return <li key={idx} className="ml-4 list-disc my-1">{line.replace('- ', '')}</li>;
                                        if (line.startsWith('```')) return null; // Skip code block markers for simple render
                                        // Simple code block visualization (very basic)
                                        if (line.includes('public class') || line.includes('System.out') || line.includes('int ')) {
                                            return <pre key={idx} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm"><code>{line}</code></pre>
                                        }
                                        return <p key={idx} className="my-2 leading-relaxed opacity-90">{line}</p>;
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Book size={64} className="mb-4 opacity-20" />
                                <p className="text-xl font-medium">Select a topic to start studying</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
