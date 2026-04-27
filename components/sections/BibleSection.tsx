import { Bible } from "@/types/api";
import { BookOpenText, House } from "lucide-react";
import { LinkButton } from "../LinkButton";

type BibleSectionProps = {
  bible: Bible;
};

export const BibleSection = ({ bible }: BibleSectionProps) => {
  return (
    <div className="border-black border-b-1 flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="self-start w-[16px] mt-[8px]">
          <BookOpenText size={16} />
        </div>
        <div className="flex flex-col grow">
          <h3 className="text-xl">
            {bible.name} ({bible.abbreviation})
          </h3>
          <p className="text-zinc-500">{bible.id}</p>
        </div>
      </div>

      <LinkButton
        title="Home"
        href="/bibles"
        className="border-[1px] w-fit !h-auto"
      >
        <House size={16} />
      </LinkButton>
    </div>
  );
};
