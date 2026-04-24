import Link from "next/link";
import { ReactNode } from "react";

export type ListItemProps = {
  title: ReactNode;
  href: string;
  info?: string;
};

/**
 * Simple list item component for rendering an item returned from the API that navigates on click
 */
export const ListItem = ({ title, href, info }: ListItemProps) => {
  return (
    <Link
      href={href}
      className="min-w-[100px] flex justify-between items-center gap-2 bg-zinc-100 hover:bg-zinc-200 p-4 border-black border-b-[1px]"
    >
      <div className="flex flex-col">
        {title}
        <p className="text-sm text-zinc-500">
          {!!info ? info : "Click to view"}
        </p>
      </div>
    </Link>
  );
};
