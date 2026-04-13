import { ReactNode } from "react";

type ActionListProps = {
  children: ReactNode | ReactNode[];
  className?: string;
};

/**
 * Renders a list of actions in a row, typically `LinkButtons`
 */
export const ActionList = ({ children, className = "" }: ActionListProps) => {
  return (
    <div
      className={`flex items-center gap-2 pb-4 border-zinc-200 border-b-1 ${className}`}
    >
      {children}
    </div>
  );
};
