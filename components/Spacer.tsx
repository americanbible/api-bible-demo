type SpacerProps = {
  border?: "l" | "r";
};

export const Spacer = ({ border = "r" }: SpacerProps) => {
  return (
    <div className={`w-[32px] h-full border-black border-${border}-[1px]`} />
  );
};
