import cntl from "cntl";

const classes = {
  typingContainer: cntl`
    p-5 rounded-3xl bg-secondary w-fit inline-flex gap-1.5
  `,
};

const Typing = () => {
  return (
    <div
      className={classes.typingContainer}
    >
      <span className="animation1 mx-[0.5px] h-2 w-2 bg-zinc-300 rounded-full"></span>
      <span className="animation2 mx-[0.5px] h-2 w-2 bg-zinc-300 rounded-full"></span>
      <span className="animation3 mx-[0.5px] h-2 w-2 bg-zinc-300 rounded-full"></span>
    </div>
  );
};

export default Typing;
