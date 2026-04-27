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
      className="min-w-[100px] p-4 flex justify-between items-center gap-2 bg-[#f1f7fe] hover:bg-[#2563eb] hover:text-white border-[#2563eb] group border-b-[1px]"
    >
      <div className="w-full flex flex-col items-center sm:items-start text-center sm:text-left">
        {title}
        <p className="text-sm text-zinc-500 group-hover:text-zinc-200">
          {!!info ? info : "Click to view"}
        </p>
      </div>
    </Link>
  );
};
