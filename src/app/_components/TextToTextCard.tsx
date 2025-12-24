"use client";

import { useState } from "react";
import { LanguageIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TextToTextCard(props: { className?: string }) {
  const { className } = props;

  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedText(null);

    try {
      const res = await fetch(
        "http://localhost:1000/api/text-to-text/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
            task: "translate",
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data.generatedText) {
        setGeneratedText(data.data.generatedText);
      } else {
        setError("Failed to translate text");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to translate text. Please try again."
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigator.clipboard.writeText(generatedText);
    }
  };

  return (
    <div
      className={`border border-white/10 rounded-3xl flex flex-col transition hover:scale-[1.01] ${
        className ?? ""
      }`}
    >
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2 px-4 py-2">
          <LanguageIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Text Translation</h2>
          <span className="ml-auto text-xs text-white/50">
            English → Russian
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/10">
          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm flex items-center gap-2">
              <LanguageIcon className="w-4 h-4" />
              Input Text (English):
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter English text to translate to Russian..."
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition resize-none min-h-[200px]"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleTranslate}
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
                  Translating...
                </>
              ) : (
                <>
                  <LanguageIcon className="w-5 h-5" />
                  Translate
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
            <label className="text-white/70 text-sm">
              Translated Text (Russian):
            </label>
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
                <p className="text-white/60 text-sm">
                  Translating your text...
                </p>
              </div>
            )}

            {!loading && !generatedText && !error && (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/40 text-sm text-center">
                  Translated text will appear here
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
              <p className="text-white/60 text-sm">
                Processing your request...
              </p>
            )}

            {!loading && !generatedText && !error && (
              <p className="text-white/40 text-sm">Enter text to get started</p>
            )}

            {!loading && generatedText && (
              <p className="text-green-400 text-sm">
                ✓ Translation completed successfully!
              </p>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
