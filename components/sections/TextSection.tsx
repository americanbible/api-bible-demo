import { ReactNode } from "react";

type TextSectionProps = {
  children: ReactNode;
  className?: string;
};

export const TextSection = ({ children, className = "" }: TextSectionProps) => {
  return (
    <div
      className={`w-full p-12 border-black border-b-[1px] flex flex-col gap-4 ${className}`}
    >
      {children}
    </div>
  );
};
