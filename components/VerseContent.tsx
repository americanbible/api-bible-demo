import { VerseContent as VerseContentType } from "@/types/api";
import { ActionList } from "./ActionList";
import { LinkButton } from "./LinkButton";

type VerseContentProps = {
  linkBase: string;
  verseContent: VerseContentType;
};

/**
 * Renders verse content returned from the API. Leverages the [scripture-styles](https://npmjs.org/package/scripture-styles) `npm`
 * package for styling.
 */
export const VerseContent = ({
  linkBase,
  verseContent: { previous, next, content },
}: VerseContentProps) => {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[60vw]">
          <div
            className="scripture-styles"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      <ActionList className="justify-center gap-4 mt-4">
        {!!previous?.id && (
          <LinkButton
            className="w-[150px]"
            href={`${linkBase}/${previous.id}`}
            title="Previous"
          />
        )}
        {!!next?.id && (
          <LinkButton
            className="w-[150px]"
            href={`${linkBase}/${next.id}`}
            title="Next"
          />
        )}
      </ActionList>
    </>
  );
};
