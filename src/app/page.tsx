import ImageAnalysis from "./_components/ImageAnalysis";
import ImageTools from "./_components/ImageTool";
import Header from "./_features/Header";

export default function Home() {
  return (
    <div className="flex flex-col justify-center ">
      <Header />
      <ImageTools />
      <ImageAnalysis />
    </div>
  );
}
