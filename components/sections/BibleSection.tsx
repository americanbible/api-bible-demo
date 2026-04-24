import { Bible } from "@/types/api";
import { BookOpenText, House } from "lucide-react";
import { LinkButton } from "../LinkButton";
import { Spacer } from "../Spacer";

type BibleSectionProps = {
  bible: Bible;
};

export const BibleSection = ({ bible }: BibleSectionProps) => {
  return (
    <div className="border-black border-b-1 flex items-center">
      <div className="w-[16px] mx-4 mt-[-20px]">
        <BookOpenText size={16} />
      </div>
      <div className="flex flex-col grow">
        <h3 className="text-xl mt-2">
          {bible.name} ({bible.abbreviation})
        </h3>
        <p className="text-zinc-500 mb-2">{bible.id}</p>
      </div>
      <div className="border-l-[1px] h-full flex flex-col">
        <div className="min-h-[18px] grow" />
        <div>
          <LinkButton title="Home" href="/" className="border-y-[1px]">
            <House size={16} />
          </LinkButton>
        </div>
        <div className="min-h-[18px] grow" />
      </div>
      <Spacer border="l" />
    </div>
  );
};
