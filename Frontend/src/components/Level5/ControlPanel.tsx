import { Button } from "@/components/ui/button";
import { Lock, Unlock, Play, RefreshCw } from "lucide-react";

interface ControlPanelProps {
    onStart: () => void;
    onReset: () => void;
    onToggleLock: () => void;
    lockEnabled: boolean;
    simulationStatus: "idle" | "running" | "crashed" | "synced";
}

export const ControlPanel = ({ onStart, onReset, onToggleLock, lockEnabled, simulationStatus }: ControlPanelProps) => {
    return (
        <div className="absolute bottom-0 w-full bg-slate-900/90 p-4 border-t-4 border-slate-700 flex items-center justify-between text-white z-50">

            <div className="flex gap-4">
                {/* Play Button */}
                <Button
                    onClick={onStart}
                    disabled={simulationStatus === "running"}
                    className="bg-green-600 hover:bg-green-700 font-bold"
                >
                    <Play className="mr-2 h-4 w-4" /> Start Threads
                </Button>

                {/* Lock Toggle */}
                <Button
                    onClick={onToggleLock}
                    variant={lockEnabled ? "default" : "secondary"}
                    className={`font-bold transition-all ${lockEnabled ? "bg-amber-500 hover:bg-amber-600 text-black" : "bg-slate-600"}`}
                >
                    {lockEnabled ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
                    {lockEnabled ? "Synchronized (Lock ON)" : "Unsynchronized (Lock OFF)"}
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="font-mono text-sm text-slate-400">
                    Status: <span className={`font-bold ${simulationStatus === "crashed" ? "text-red-500" :
                            simulationStatus === "synced" ? "text-green-500" : "text-white"
                        }`}>
                        {simulationStatus.toUpperCase()}
                    </span>
                </div>

                <Button onClick={onReset} variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

        </div>
    );
};
