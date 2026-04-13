import { ListItem, ListItemProps } from "./ListItem";

type ListProps = {
  items: ListItemProps[];
};

/**
 * Simple list component for rendering API results
 */
export const List = ({ items }: ListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {!items.length && (
        <div className="text-sm">No items available for this Bible.</div>
      )}
      {items.map((item) => (
        <ListItem {...item} key={item.href} />
      ))}
    </div>
  );
};
