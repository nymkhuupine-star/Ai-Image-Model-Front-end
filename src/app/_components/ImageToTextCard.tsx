"use client";

import { useState, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon, ClipboardDocumentIcon, CheckIcon, ArrowUpTrayIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { AnimatedText } from "./AnimatedText";
import axios from "axios";

export default function ImageToTextCard(props: { className?: string }) {
  const { className } = props;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const applyFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setDescription("");
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    applyFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) applyFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setDescription("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await axios.post(
        "https://ai-image-model-back-end.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;

      if (data.success && data.description) {
        setDescription(data.description);
        setIsModalOpen(true);
      } else {
        setDescription("No description could be generated for this image.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err?.message || "Failed to generate description. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedImage(null);
    setPreview(null);
    setDescription("");
    setError(null);
  };

  const handleCopy = () => {
    if (!description) return;
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className={`border border-white/10 rounded-3xl flex flex-col md:flex-row transition hover:scale-[1.01] ${
          className ?? ""
        }`}
      >
        {/* IMAGE AREA — drag & drop */}
        <div
          className={`relative md:w-1/2 h-64 md:h-auto border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center cursor-pointer overflow-hidden rounded-l-3xl transition-colors ${
            isDragging ? "bg-purple-500/20 border-purple-400" : ""
          }`}
          onClick={() => preview && setIsModalOpen(true)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <>
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="absolute bottom-2 right-2 bg-red-600/70 hover:bg-red-500 text-white p-2 rounded-full transition"
                aria-label="Delete image"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6 select-none">
              {isDragging ? (
                <>
                  <ArrowUpTrayIcon className="w-12 h-12 text-purple-400" />
                  <span className="text-purple-300 font-medium">Drop image here</span>
                </>
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 text-white/30" />
                  <span className="text-white/40 text-sm">Click "Choose File" or drag & drop an image here</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* ACTION AREA */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4 h-full">
          <label className="cursor-pointer flex justify-center gap-2 items-center bg-white/10 hover:bg-white/20 rounded-full py-2 text-white text-sm transition shrink-0">
            <ArrowUpTrayIcon className="w-4 h-4" />
            Choose File
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedImage}
            className={`rounded-full py-3 font-semibold text-white transition shrink-0 flex items-center justify-center gap-2 ${
              loading || !selectedImage
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
              "Generate Description"
            )}
          </button>

          {/* RESULT BOX */}
          <div className="flex-1 overflow-y-auto p-4 rounded-xl border border-white/20 text-center relative">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Analyzing image...</p>
              </div>
            )}

            {!loading && description === "" && (
              <p className="text-white/40">Generated text will appear here</p>
            )}

            {!loading && description !== "" && (
              <AnimatedText text={description} className="text-base md:text-lg" speed={20} />
            )}
          </div>

          {/* COPY BUTTON */}
          {description && !loading && (
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  Copy description
                </>
              )}
            </button>
          )}

          {error && <p className="text-red-400 text-sm text-center shrink-0">{error}</p>}
        </div>
      </div>

      {/* MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-black/30 backdrop-blur-2xl rounded-2xl max-w-2xl w-full border border-white/20 relative max-h-[85vh] flex flex-col overflow-hidden">
                {preview && (
<<<<<<< HEAD
                  <Image
                    src={preview}
                    className="max-h-[70vh] w-full object-contain"
                    alt="Preview"
                  />
=======
                  <img src={preview} className="max-h-[45vh] w-full object-contain shrink-0" alt="Preview" />
>>>>>>> 0f48b3b (push)
                )}

                {description && (
                  <div className="p-5 overflow-y-auto">
                    <p className="text-white text-center text-base">{description}</p>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-white text-sm transition"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
