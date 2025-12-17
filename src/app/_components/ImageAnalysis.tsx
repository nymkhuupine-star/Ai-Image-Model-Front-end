"use client";
import { useState } from "react";
import ArticlelIcon from "../_icons/ArticleIcon";
import Image from "next/image";

export default function ImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="flex pl-[320px] mt-[24px] flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <ArticlelIcon />
        <p className="text-[#09090B] font-sans text-xl font-semibold">
          Image analysis
        </p>
      </div>

      <p className="text-gray-500 text-sm">
        Upload a food photo, and AI will detect the ingredients.
      </p>

      <label
        htmlFor="imageUpload"
        className="w-[580px] h-[40px] flex items-center justify-center border border-gray-300 rounded cursor-pointer bg-white hover:bg-gray-50"
      >
        <span className="mr-2">Choose File</span>
        <span className="text-gray-400 text-sm">JPG, PNG</span>
      </label>

      <input
        id="imageUpload"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
          }
        }}
      />

      {image && (
        <Image
          src={image}
          alt="preview"
          className="w-[200px] rounded border"
          width={200}
          height={130}
          unoptimized
        />
      )}
    </div>
  );
}
