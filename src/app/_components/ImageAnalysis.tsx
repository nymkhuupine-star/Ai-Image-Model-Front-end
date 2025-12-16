"use client";

import ArticlelIcon from "../_icons/ArticleIcon";

export default function ImageAnalysis() {
  return (
    <div className="flex pl-[320px] mt-[24px] flex-col">
      <div className=" flex flex-row">
        <ArticlelIcon />
        <p className="text-[#09090B] font-sans text-xl font-semibold leading-7 tracking-normal">
          {" "}
          Image analysis{" "}
        </p>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-sans font-normal leading-5 tracking-normal">
          Upload a food photo, and AI will detect the ingredients.
        </p>
        <label className="w-[580px] h-[40px] flex items-center justify-center border border-gray-300 rounded cursor-pointer bg-white ">
          <div className="flex flex-row">
            <p> Choose File </p>
            <p> JPG , PNG</p>
          </div>

          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                console.log(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
