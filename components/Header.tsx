import { Bible } from "@/types/api";
import { BookOpenText } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";
import Link from "next/link";

type HeaderProps = {
  bible: Bible;
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * Renders a head consisting of the following:
 *   - Information about the currently selected Bible (name, ID, etc.)
 *   - Breadcrumbs
 *   - A page title & subtitle (if provided)
 */
export const Header = ({
  bible,
  title,
  subtitle,
  breadcrumbs,
}: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[100vw] ml-[-32px] border-zinc-200 border-t-1 border-b-1 flex gap-2 py-2 px-8 bg-zinc-50 mb-2">
        <BookOpenText size={16} className="mt-[6px]" />
        <div className="flex flex-col grow">
          <h3 className="text-xl">
            {bible.name} ({bible.abbreviation})
          </h3>
          <p className="text-zinc-500">{bible.id}</p>
        </div>
        <div className="grow" />
        <div className="self-center mr-4">
          <Link href="/" className="hover:underline">
            Reset
          </Link>
        </div>
      </div>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex gap-2 items-center mt-[-4px]">
        <h1 className="font-bold text-3xl">{title}</h1>
        {!!subtitle && (
          <h5 className="text-lg text-zinc-500 mt-[2px]">({subtitle})</h5>
        )}
      </div>
    </div>
  );
};
