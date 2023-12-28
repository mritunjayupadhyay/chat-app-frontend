import Image from "next/image";
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
        <Image
            alt={alt || 'Message Attachment full'}
            src={imageUrl || ''}                            
            fill
            style={{objectFit: "cover"}}
            className="h-full w-full object-cover"
        />
      </div>
      ) : null}
        <Image
            alt={alt || 'Message Attachment'}
            src={imageUrl || ''} 
            onClick={() => setResized(true)}                           
            style={{objectFit: "cover"}}
            width={400}
            height={400}
            className={classNames}        />
        </>
    );
}

export default ResizeImage;