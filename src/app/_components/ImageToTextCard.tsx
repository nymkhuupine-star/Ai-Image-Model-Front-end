"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { AnimatedText } from "./AnimatedText";

export default function ImageToTextCard(props: { className?: string }) {
  const { className } = props;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setDescription("");
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setDescription("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch(
        "https://ai-image-model-back-end.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();

      // ✅ Backend response бүтэц: { success, description, imageUrl, fileName }
      if (data.success && data.description) {
        setDescription(data.description);
        setIsModalOpen(true);
      } else {
        setDescription("No description could be generated for this image.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate description. Please try again."
      );
      setDescription("No description could be generated for this image.");
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

  return (
    <>
      <div
        className={`border border-white/10 rounded-3xl flex flex-col md:flex-row transition hover:scale-[1.01] ${
          className ?? ""
        }`}
      >
        {/* IMAGE AREA */}
        <div
          className="relative md:w-1/2 h-64 md:h-auto border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center cursor-pointer overflow-hidden rounded-l-3xl"
          onClick={() => preview && setIsModalOpen(true)}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
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
            <span className="text-white/40">No image selected</span>
          )}
        </div>

        {/* ACTION AREA */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <label className="cursor-pointer flex justify-center bg-white/10 hover:bg-white/20 rounded-full py-2 text-white text-sm transition">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedImage}
            className={`rounded-full py-3 font-semibold text-white transition ${
              loading || !selectedImage
                ? "bg-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
            }`}
          >
            {loading ? "Generating..." : "Generate Description"}
          </button>

          {/* RESULT BOX */}
          <div className="mt-2 p-4 min-h-[80px] rounded-xl border border-white/20 text-center">
            {loading && (
              <p className="text-white/60">Generating description...</p>
            )}

            {!loading && description === "" && (
              <p className="text-white/40">Generated text will appear here</p>
            )}

            {!loading && description !== "" && (
              <AnimatedText
                text={description}
                className="text-base md:text-lg"
                speed={20}
              />
            )}

            {!loading && description !== "" && (
              <p className="text-white">{description}</p>
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
              <Dialog.Panel className="bg-black/30 backdrop-blur-2xl rounded-2xl max-w-3xl w-full border border-white/20 relative overflow-hidden">
                {preview && (
                  <Image
                    src={preview}
                    className="max-h-[70vh] w-full object-contain"
                    alt="Preview"
                  />
                )}

                {description && (
                  <div className="p-6">
                    <p className="text-white text-center text-lg">
                      {description}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition"
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
