import { VerseContent as VerseContentType } from "@/types/api";
import { ActionList } from "./ActionList";
import { LinkButton } from "./LinkButton";

type VerseContentProps = {
  linkBase: string;
  verseContent: VerseContentType;
};

export const VerseContent = ({
  linkBase,
  verseContent: { previous, next, content },
}: VerseContentProps) => {
  return (
    <>
      <ActionList>
        {!!previous?.id && (
          <LinkButton
            href={`${linkBase}/${previous.id}`}
            title="Previous Verse"
          />
        )}
        {!!next?.id && (
          <LinkButton href={`${linkBase}/${next.id}`} title="Next Verse" />
        )}
      </ActionList>
      {!previous?.id && !next?.id && (
        <div className="w-full pb-4 border-zinc-200 border-b-1" />
      )}
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[60vw]">
          <div
            className="scripture-styles"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </>
  );
};
