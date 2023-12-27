import cntl from "cntl";
import {
    XMarkIcon
  } from "@heroicons/react/20/solid";
import { useState } from "react";

type PropTypes = {
    imageUrl?: string;
    classNames?: string;
    alt?: string;
}
const ResizeImage = ({ imageUrl, classNames, alt }: PropTypes) => {
    const [resized, setResized] = useState<boolean>(false);

    return (
        <>
        {resized ? (
        <div className="h-full z-50 p-8 overflow-hidden w-full absolute inset-0 bg-black flex justify-center items-center">
        <XMarkIcon
          className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
          onClick={() => setResized(false)}
        />
        <img
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={alt}
        />
      </div>
      ) : null}
            
        <img
            className={classNames}
            src={imageUrl}
            onClick={() => setResized(true)}
            alt={alt}
        />
        </>
    );
}

export default ResizeImage;