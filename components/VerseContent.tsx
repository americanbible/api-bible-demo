import { VerseContent as VerseContentType } from "@/types/api";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Link from "next/link";

type VerseContentProps = {
  linkBase: string;
  verseContent: VerseContentType;
};

export const VerseContent = ({
  linkBase,
  verseContent: { previous, next, content },
}: VerseContentProps) => {
  const navButtonClassName = "w-[24px]  pt-4";
  return (
    <div className="w-full flex gap-8 pt-2 border-t-zinc-200 border-t-1">
      <div className={navButtonClassName}>
        {!!previous && (
          <Link href={`${linkBase}/${previous.id}`} title="Previous">
            <ArrowLeftCircle size={32} className="hover:text-zinc-600" />
          </Link>
        )}
      </div>
      <div className="grow">
        <div
          className="scripture-styles"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div className={navButtonClassName}>
        {!!next && (
          <Link href={`${linkBase}/${next.id}`} title="Next">
            <ArrowRightCircle size={32} className="hover:text-zinc-600" />
          </Link>
        )}
      </div>
    </div>
  );
};
