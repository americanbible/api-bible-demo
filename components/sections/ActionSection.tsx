import { ReactNode } from "react";

type ActionListProps = {
  children: ReactNode | ReactNode[];
  className?: string;
};

/**
 * Renders a list of actions in a row, typically `LinkButtons`
 */
export const ActionSection = ({
  children,
  className = "",
}: ActionListProps) => {
  return (
    <div className="flex w-full">
      <div className={`w-full flex border-black border-b-1 ${className}`}>
        <div className="grow flex">{children}</div>
      </div>
    </div>
  );
};
