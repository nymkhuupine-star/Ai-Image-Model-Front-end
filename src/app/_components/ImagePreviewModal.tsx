// "use client";

// import { Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";

// type ImagePreviewModalProps = {
//   isOpen: boolean;
//   imageUrl: string | null;
//   prompt: string;
//   onClose: () => void;
//   onDownload: () => void;
// };

// export default function ImagePreviewModal({
//   isOpen,
//   imageUrl,
//   prompt,
//   onClose,
//   onDownload,
// }: ImagePreviewModalProps) {
//   if (!imageUrl) return null;

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/60" />
//         </Transition.Child>

//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <Dialog.Panel className="bg-black/30 backdrop-blur-2xl rounded-2xl max-w-4xl w-full border border-white/20 relative overflow-hidden">
//               <img
//                 src={imageUrl}
//                 className="max-h-[80vh] w-full object-contain"
//                 alt="Generated"
//               />

//               <div className="p-6">
//                 <p className="text-white/70 text-center italic">"{prompt}"</p>
//               </div>

//               <div className="absolute top-4 right-4 flex gap-2">
//                 <button
//                   onClick={onDownload}
//                   className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition"
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
