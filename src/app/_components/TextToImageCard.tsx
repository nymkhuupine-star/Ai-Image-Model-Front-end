"use client";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
export default function TextToImageCard(props: { className?: string }) {
  const { className } = props;
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const res = await fetch(
        "https://ai-image-model-back-end.onrender.com/api/text-to-image/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setIsModalOpen(true);
      } else {
        setError("Failed to generate image");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = () => {
    setGeneratedImage(null);
    setPrompt("");
    setError(null);
  };
  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
    }
  };
  return (
    <>
      <div
        className={`border border-white/10 rounded-3xl flex flex-col md:flex-row transition hover:scale-[1.01] ${
          className ?? ""
        }`}
      >
        <div
          className="relative md:w-1/2 h-64 md:h-auto border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center cursor-pointer overflow-hidden rounded-l-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20"
          onClick={() => generatedImage && setIsModalOpen(true)}
        >
          {generatedImage ? (
            <>
              <Image
                src={generatedImage}
                alt="Generated"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="absolute bottom-2 right-2 bg-red-600/70 hover:bg-red-500 text-white p-2 rounded-full transition"
                aria-label="Delete image"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <SparklesIcon className="w-12 h-12 text-white/30" />
              <span className="text-white/40">
                Generated image appears here
              </span>
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm">Enter your prompt:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains..."
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`rounded-full py-3 font-semibold text-white transition flex items-center justify-center gap-2 ${
              loading || !prompt.trim()
                ? "bg-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>

          {generatedImage && (
            <button
              onClick={handleDownload}
              className="rounded-full py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
            >
              Download Image
            </button>
          )}
          <div className="mt-2 p-4 min-h-[60px] rounded-xl border border-white/20 flex items-center justify-center">
            {loading && (
              <p className="text-white/60">Creating your masterpiece...</p>
            )}

            {!loading && !generatedImage && !error && (
              <p className="text-white/40">Enter a prompt to get started</p>
            )}

            {!loading && generatedImage && (
              <p className="text-green-400">✓ Image generated successfully!</p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>

      {/* MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-black/30 backdrop-blur-2xl rounded-2xl max-w-4xl w-full border border-white/20 relative overflow-hidden">
                {generatedImage && (
                  <>
                    <Image
                      src={generatedImage}
                      className="max-h-[80vh] w-full object-contain"
                      alt="Generated"
                    />
                    <div className="p-6">
                      <p className="text-white/70 text-center italic">
                        &quot;{prompt} &quot;
                      </p>
                    </div>
                  </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
