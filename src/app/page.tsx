import ImageAnalysis from "./_components/ImageAnalysis";

import { WarpBackground } from "@/components/ui/warp-background";

export default function Home() {
  return (
    <WarpBackground>
      <div className="flex flex-col justify-center ">
        <ImageAnalysis />
      </div>
    </WarpBackground>
  );
}
