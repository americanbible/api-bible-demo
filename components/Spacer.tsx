type SpacerProps = {
  border?: "l" | "r";
};

export const Spacer = ({ border = "r" }: SpacerProps) => {
  return (
    <div
      className={`hidden sm:block w-[32px] h-full border-black border-${border}-[1px]`}
    />
  );
};
