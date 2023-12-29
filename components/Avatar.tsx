import Image from "next/image";
import LetterAvatar from "./LetterAvatar";

type PropTypes = {
    name: string;
    classNames?: string;
    imageUrl: string;
}

const Avatar = ({name, classNames, imageUrl}: PropTypes) => {
    if (imageUrl) {
        return (
            <Image
                alt={"Avatar"}
                src={imageUrl}
                width={56}
                height={56}
                style={{objectFit: "cover"}}
                className={classNames}
            />
        )
    }
    return LetterAvatar({name, classNames});
}

export default Avatar;