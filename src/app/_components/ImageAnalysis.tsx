"use client";

import { Tab } from "@headlessui/react";
import ImageToTextCard from "./ImageToTextCard";
import TextToImageCard from "./TextToImageCard";
import TextToTextCard from "./TextToTextCard";

const categories = ["Image analysis", "Image creator", "Text translation"];

export default function ImageAnalysis() {
  return (
    <div className="flex justify-center pt-10 sm:pt-16 lg:pt-24 px-4">
      <Tab.Group>
        <Tab.List className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((name) => (
            <Tab
              key={name}
              className={({ selected }) =>
                `px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  selected
                    ? "bg-white text-black"
                    : "bg-slate-500/80 hover:bg-slate-500 text-white"
                }`
              }
            >
              {name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="rounded-xl w-full max-w-5xl">
          <Tab.Panel>
            <div className="flex justify-center items-center w-full py-6 sm:py-10">
              <div className="w-full rounded-3xl bg-slate-500/60">
                <ImageToTextCard className="min-h-[520px] md:min-h-[560px]" />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex justify-center items-center w-full py-6 sm:py-10">
              <div className="w-full rounded-3xl bg-slate-500/60">
                <TextToImageCard className="min-h-[520px] md:min-h-[560px]" />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex justify-center items-center w-full py-6 sm:py-10">
              <div className="w-full rounded-3xl bg-slate-500/60">
                <TextToTextCard className="min-h-[520px] md:min-h-[560px]" />
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
