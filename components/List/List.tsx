import { ListItem, ListItemProps } from "./ListItem";

type ListProps = {
  items: ListItemProps[];
};

export const List = ({ items }: ListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <ListItem {...item} key={item.href} />
      ))}
    </div>
  );
};
