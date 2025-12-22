"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ImageCard(props: { className?: string }) {
  const { className } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setDescription(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch("http://localhost:1000/describe-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setDescription(data.description);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setSelectedImage(null);
    setPreview(null);
    setDescription(null);
  };

  return (
    <>
      <div
        className={`border border-white/10 rounded-3xl flex flex-col md:flex-row transition hover:scale-[1.01] ${
          className ?? ""
        }`}
      >
        <div
          className="relative md:w-1/2 h-64 md:h-auto border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center cursor-pointer"
          onClick={() => preview && setIsModalOpen(true)}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                fill
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
            {loading ? "Generating..." : "Generate Description"}
          </button>

          {selectedImage && (
            <p className="text-white/70 text-sm mt-2 truncate">
              Selected: {selectedImage.name}
            </p>
          )}
          {description && (
            <p className="text-white mt-2 text-center">{description}</p>
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

          <div className="flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="backdrop-blur-2xl rounded-2xl overflow-hidden max-w-3xl w-full flex flex-col items-center justify-center shadow-xl border border-white/20  bg-black/30">
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview Modal"
                    className="object-contain max-h-[70vh] w-full"
                  />
                )}
                {description && (
                  <p className="text-white mt-4 text-center">{description}</p>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
