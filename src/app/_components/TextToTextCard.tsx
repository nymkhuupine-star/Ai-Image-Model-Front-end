"use client";

import { useState } from "react";
import { 
  SparklesIcon, 
  TrashIcon,
  DocumentTextIcon,
  LanguageIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline";

type TaskType = 'summarize' | 'translate' | 'paraphrase' | 'general';

interface TaskOption {
  value: TaskType;
  label: string;
  icon: typeof SparklesIcon;
  placeholder: string;
}

const TASK_OPTIONS: TaskOption[] = [
  {
    value: 'general',
    label: 'General Text Generation',
    icon: SparklesIcon,
    placeholder: 'Enter any text or question...'
  },
  {
    value: 'summarize',
    label: 'Summarize',
    icon: DocumentTextIcon,
    placeholder: 'Enter text to summarize...'
  },
  {
    value: 'translate',
    label: 'Translate',
    icon: LanguageIcon,
    placeholder: 'Enter text to translate...'
  },
  {
    value: 'paraphrase',
    label: 'Paraphrase',
    icon: DocumentDuplicateIcon,
    placeholder: 'Enter text to paraphrase...'
  }
];

export default function TextToTextCard(props: { className?: string }) {
  const { className } = props;

  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskType>('general');

  const currentTask = TASK_OPTIONS.find(t => t.value === selectedTask) || TASK_OPTIONS[0];

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedText(null);

    try {
      const endpoint = selectedTask === 'general' 
        ? 'http://localhost:1000/api/text-to-text'
        : `http://localhost:1000/api/text-to-text/${selectedTask}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: inputText,
          task: selectedTask 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data.generatedText) {
        setGeneratedText(data.data.generatedText);
      } else {
        setError("Failed to generate text");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate text. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setGeneratedText(null);
    setInputText("");
    setError(null);
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
    }
  };

  return (
    <div
      className={`border border-white/10 rounded-3xl flex flex-col transition hover:scale-[1.01] ${
        className ?? ""
      }`}
    >
      {/* HEADER - Task Selection */}
      <div className="border-b border-white/10 p-4">
        <div className="flex gap-2 overflow-x-auto">
          {TASK_OPTIONS.map((task) => {
            const Icon = task.icon;
            return (
              <button
                key={task.value}
                onClick={() => setSelectedTask(task.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition ${
                  selectedTask === task.value
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{task.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* INPUT AREA */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/10">
          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm flex items-center gap-2">
              <currentTask.icon className="w-4 h-4" />
              Input Text:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={currentTask.placeholder}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition resize-none min-h-[200px]"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className={`flex-1 rounded-full py-3 font-semibold text-white transition flex items-center justify-center gap-2 ${
                loading || !inputText.trim()
                  ? "bg-white/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>

            {(inputText || generatedText) && (
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Clear all"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* OUTPUT AREA */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-white/70 text-sm">Generated Text:</label>
            {generatedText && (
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                Copy
              </button>
            )}
          </div>

          <div className="flex-1 p-4 rounded-xl border border-white/20 bg-white/5 min-h-[200px] overflow-y-auto">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Generating your text...</p>
              </div>
            )}

            {!loading && !generatedText && !error && (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/40 text-sm text-center">
                  Generated text will appear here
                </p>
              </div>
            )}

            {!loading && generatedText && (
              <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                {generatedText}
              </p>
            )}
          </div>

          {/* STATUS MESSAGE */}
          <div className="p-3 rounded-xl border border-white/20 flex items-center justify-center min-h-[50px]">
            {loading && (
              <p className="text-white/60 text-sm">Processing your request...</p>
            )}

            {!loading && !generatedText && !error && (
              <p className="text-white/40 text-sm">Enter text to get started</p>
            )}

            {!loading && generatedText && (
              <p className="text-green-400 text-sm">✓ Text generated successfully!</p>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}