"use client";

import { Tab } from "@headlessui/react";
import ImageCard from "./ImageCard";


const categories = ["Image to image", "Popular", "Trending"];

export default function ImageAnalysis() {
  return (
    <div className="bg-gray-900 text-white flex justify-center pt-24">
      <Tab.Group>
        <Tab.List className="flex  justify-center gap-3">
          {categories.map((name) => (
            <Tab
              key={name}
              className={({ selected }) =>
                `px-4 py-2 rounded-full text-sm font-semibold ${selected ? "bg-white text-black" : "bg-white/10 text-white"
                }`
              }
            >
              {name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className=" rounded-xl w-[1000px] ">
          <Tab.Panel>
            <div className="flex justify-center  items-center w-full py-12">
              <div className="w-full min-h-screen bg-gray-900 max-w-4xl">
                <ImageCard className="h-[500px] md:h-[550px]" />
              </div>
            </div>

          </Tab.Panel>
          <Tab.Panel>Popular content</Tab.Panel>
          <Tab.Panel>Trending content</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
