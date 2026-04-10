import { ReactNode } from "react";

type ActionListProps = {
  children: ReactNode | ReactNode[];
};

export const ActionList = ({ children }: ActionListProps) => {
  return (
    <div className="flex items-center gap-2 pb-4 border-zinc-200 border-b-1">
      {children}
    </div>
  );
};
