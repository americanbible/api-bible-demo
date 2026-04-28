import { ListItem, ListItemProps } from "./ListItem";

type ListProps = {
  title?: string;
  hideHeader?: boolean;
  items: ListItemProps[];
};

/**
 * Simple list component for rendering API results
 */
export const ListSection = ({
  title = "Results",
  hideHeader,
  items,
}: ListProps) => {
  return (
    <div className="w-full flex flex-col">
      {!hideHeader && (
        <div className="flex items-end border-black border-b-[1px] px-8 pt-12">
          <h3 className="text-xl font-bold px-4 py-2 border-black border-x-[1px] border-t-[1px]">
            {title}
          </h3>
          <h5 className="text-lg px-4 py-2 border-black border-r-[1px] border-t-[1px]">
            {items.length}
          </h5>
        </div>
      )}
      <div className="flex flex-col">
        {!items.length && (
          <div className="text-sm w-full p-4 border-b-[1px]">
            No items available for this Bible.
          </div>
        )}
        {items.map((item) => (
          <ListItem {...item} key={item.href} />
        ))}
      </div>
    </div>
  );
};
