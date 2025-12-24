"use client";

import { Tab } from "@headlessui/react";
import ImageToTextCard from "./ImageToTextCard";
import TextToImageCard from "./TextToImageCard";
import TextToTextCard from "./TextToTextCard";

const categories = ["Image analysis", "Image creator", "Ingredient recognition"];

export default function ImageAnalysis() {
  return (
    <div className="  flex justify-center pt-24">
      <Tab.Group>
        <Tab.List className="flex  justify-center gap-3">
          {categories.map((name) => (
            <Tab
              key={name}
              className={({ selected }) =>
                `px-4 py-2 rounded-full text-sm font-semibold ${
                  selected ? "bg-white text-black" : "bg-slate-500 text-white"
                }`
              }
            >
              {name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className=" rounded-xl w-[1000px]  ">
          <Tab.Panel>
            <div className="flex justify-center   items-center w-full py-12">
              <div className="w-full rounded-3xl bg-slate-500  ">
                <ImageToTextCard className="h-[500px] md:h-[550px]" />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel> <div className="flex justify-center   items-center w-full py-12">
              <div className="w-full rounded-3xl bg-slate-500  ">
                <TextToImageCard className="h-[500px] md:h-[550px]" />
              </div>
            </div></Tab.Panel>
          <Tab.Panel><div className="flex justify-center   items-center w-full py-12">
              <div className="w-full rounded-3xl bg-slate-500  ">
                <TextToTextCard className="h-[500px] md:h-[550px]" />
              </div>
            </div></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
