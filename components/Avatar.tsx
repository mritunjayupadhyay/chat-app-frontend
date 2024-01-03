import Image from "next/image";
import LetterAvatar from "./LetterAvatar";
import ResizeImage from "./resizedImage";

type PropTypes = {
    name: string;
    classNames?: string;
    imageUrl: string;
    resized?: boolean;
}

const Avatar = ({name, classNames, imageUrl, resized = false}: PropTypes) => {
    if (imageUrl) {
        if (resized === true) {
            return <ResizeImage imageUrl={imageUrl} classNames={classNames} alt="Avatar" />
        }
        return (
            <Image
                alt={"Avatar"}
                src={imageUrl}
                width={48}
                height={48}
                style={{objectFit: "cover"}}
                className={classNames}
            />
        )
    }
    return LetterAvatar({name, classNames});
}

export default Avatar;