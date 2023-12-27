import {
    XMarkIcon
  } from "@heroicons/react/20/solid";

type PropTypes = {
    imageUrl: string;
    onClose: () => void;
}
const ResizeImage = ({ imageUrl, onClose }: PropTypes) => {
    return (
        <div className="h-full z-40 p-8 overflow-hidden w-full absolute inset-0 bg-black/70 flex justify-center items-center">
          <XMarkIcon
            className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
            onClick={() => onClose()}
          />
          <img
            className="w-full h-full object-contain"
            src={imageUrl}
            alt="chat image"
          />
        </div>
    );
}

export default ResizeImage;