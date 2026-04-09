import { Bible } from "@/types/api";
import { Book, BookOpenText, BookText, Search } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";
import { LinkButton } from "./LinkButton";

type BibleInfoHeaderProps = {
  bible: Bible;
  breadcrumbs: BreadcrumbItem[];
};

export const BibleInfoHeader = ({
  bible,
  breadcrumbs,
}: BibleInfoHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <Breadcrumbs items={breadcrumbs} />
      <div className="bg-zinc-100 border-zinc-500 border-1 rounded-md w-full p-8 flex flex-col gap-4">
        <div className="flex gap-2">
          <BookOpenText size={16} className="mt-[6px]" />
          <div className="flex flex-col grow">
            <h3 className="text-xl">
              {bible.name} ({bible.abbreviation})
            </h3>
            <p className="text-zinc-500">{bible.id}</p>
          </div>
        </div>
        <div className="w-full flex items-center gap-4">
          {" "}
          <LinkButton title="View Books" href={`/bibles/${bible.id}/books`}>
            <Book size={16} />
          </LinkButton>
          <LinkButton
            title="Find Passages"
            href={`/bibles/${bible.id}/passages`}
          >
            <BookText size={16} />
          </LinkButton>
          <LinkButton title="Search" href={`/bibles/${bible.id}/search`}>
            <Search size={16} />
          </LinkButton>
        </div>
      </div>
    </div>
  );
};
