import React from "react";
import cntl from "cntl";

const classes = {
    inputClass: (className?: string) => cntl`
    block w-full rounded-xl outline outline-[1px] 
    outline-zinc-400 border-0 py-2 sm:py-4 px-3 sm:px-5 bg-bgInput 
    text-white font-light placeholder:text-white/70
    ${className || ''}
    `
}
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      {...props}
      className={classes.inputClass(props.className)}
    />
  );
};

export default Input;
