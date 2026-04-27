import { LinkButton, LinkButtonProps } from "../LinkButton";

type ActionListProps = {
  className?: string;
  items: LinkButtonProps[];
};

/**
 * Renders a list of actions in a row, typically `LinkButtons`
 */
export const ActionSection = ({ items, className = "" }: ActionListProps) => {
  return (
    <div
      className={`w-full flex flex-col md:flex-row border-black border-b-1 ${className}`}
    >
      {items.map((item) => (
        <LinkButton
          key={item.href}
          {...item}
          className={`border-b-[1px] last:border-b-0 md:grow md:border-b-0 md:border-r-[1px] md:last:border-r-0 ${item.className ?? ""}`}
        />
      ))}
    </div>
  );
};
