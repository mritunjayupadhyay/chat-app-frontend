import cntl from "cntl";

type PropTypes = {
    name: string;
    classNames?: string;
}

const classes = {
    avatar: (classNames?: string) => cntl`
    flex w-12 h-12 rounded-full justify-center 
    items-center text-white
    ${classNames || ''}
    `
}
const LetterAvatar = ({ name, classNames }: PropTypes) => {
    const getInitials = (name: string) => {
        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];
        const firstLetter = firstName[0];
        const lastLetter = lastName ? lastName[0] : firstName[1];
        return `${firstLetter}${lastLetter}`;
      }
    
      const generateBackground = (name: string) => {
        let hash = 0;
        let i;
    
        for (i = 0; i < name.length; i += 1) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        let color = "#";
    
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
    
        return color;
      }
    
      let initials = getInitials(name);
      let color = generateBackground(name);
      const customStyle = {
        background: color,
      };
    return (
        <div className={classes.avatar(classNames)} style={customStyle}>
        <span className="uppercase text-white font-normal"> {initials} </span>
      </div>
    )
}

export default LetterAvatar;