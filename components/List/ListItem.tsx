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
      className="min-w-[100px] flex justify-between items-center gap-2 bg-zinc-50 border-zinc-100 hover:bg-zinc-100 rounded-sm p-4"
    >
      <div className="flex flex-col">
        {title}
        <p className="text-sm text-zinc-500">Click to view</p>
      </div>
      {!!info && <div className="font-light">{info}</div>}
    </Link>
  );
};
