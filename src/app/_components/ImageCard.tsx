"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ImageCard(props: { className?: string }) {
  const { className } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch("http://localhost:1000/anime", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // Backend-с буусан anime зурагны path-г preview болгоно
      setPreview(`http://localhost:1000/${data.path}`);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Anime generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setSelectedImage(null);
    setPreview(null);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-xl transition hover:scale-[1.01]">
        <div
          className="relative md:w-1/2 h-64 md:h-auto bg-white/5 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center cursor-pointer"
          onClick={() => preview && setIsModalOpen(true)}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="absolute bottom-2 right-2 bg-red-600/70 hover:bg-red-500 text-white p-2 rounded-full transition"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <span className="text-white/50 text-center p-4">
              No image selected
            </span>
          )}
          {preview && (
            <div className="absolute bottom-2 left-2 bg-white/20 text-white px-3 py-1 rounded-full text-xs">
              Click to preview
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-center gap-4">
          <label className="cursor-pointer flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full py-2 text-white text-sm font-medium">
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
            className={`w-full rounded-full py-3 font-semibold text-white transition transform ${
              loading
                ? "bg-white/30 cursor-not-allowed animate-pulse"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {selectedImage && (
            <p className="text-white/70 text-sm mt-2 truncate">
              Selected: {selectedImage.name}
            </p>
          )}
        </div>
      </div>

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
              <Dialog.Panel className="bg-white/5 backdrop-blur-2xl rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex items-center justify-center shadow-xl border border-white/20">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview Modal"
                    className="object-contain w-full h-full p-4"
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
