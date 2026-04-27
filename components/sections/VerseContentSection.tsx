import { VerseContent as VerseContentType } from "@/types/api";
import { ActionSection } from "./ActionSection";
import { LinkButton } from "../LinkButton";
import { Spacer } from "../Spacer";

type VerseContentProps = {
  linkBase?: string;
  verseContent: VerseContentType;
  title?: string;
};

/**
 * Renders verse content returned from the API. Leverages the [scripture-styles](https://npmjs.org/package/scripture-styles) `npm`
 * package for styling.
 */
export const VerseContentSection = ({
  linkBase,
  title = "Verses",
  verseContent: { previous, next, content, verseCount },
}: VerseContentProps) => {
  return (
    <>
      <div className="flex items-stretch border-black border-b-[1px]">
        <Spacer />
        <h3 className="text-xl font-bold px-4 py-2 border-black border-r-[1px]">
          {title}
        </h3>
        <h5 className="text-lg px-4 py-2 border-black border-r-[1px]">
          {verseCount} {verseCount === 1 ? "Verse" : "Verses"}
        </h5>
      </div>
      <div className="w-full flex flex-col items-center border-b-[1px]">
        <div className="w-full">
          <div
            className="scripture-styles p-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      {!!linkBase && (
        <div className="w-full flex flex-row border-black border-b-1">
          {!!previous?.id ? (
            <LinkButton
              className="w-[50%] border-r-[1px]"
              href={`${linkBase}/${previous.id}`}
              title="Previous"
            />
          ) : (
            <div className="w-[50%] h-full border-r-[1px]" />
          )}
          {!!next?.id ? (
            <LinkButton
              className="w-[50%]"
              href={`${linkBase}/${next.id}`}
              title="Next"
            />
          ) : (
            <div className="w-[50%]" />
          )}
        </div>
      )}
    </>
  );
};
