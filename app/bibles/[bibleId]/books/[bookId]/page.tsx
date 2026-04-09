import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { LinkButton } from "@/components/LinkButton";
import { Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { Book as BookIcon } from "lucide-react";

type BookPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

export default async function BookPage(props: BookPageProps) {
  const { bibleId, bookId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
    params: { "include-chapters": "true" },
  });
  return (
    <div className="flex flex-col gap-4">
      <BibleInfoHeader
        bible={bible}
        breadcrumbs={[
          {
            title: "Bibles",
            href: "/",
          },
          {
            title: bible.name,
            href: `/bibles/${bibleId}`,
          },
          {
            title: "Books",
            href: `/bibles/${bibleId}/books`,
          },
          {
            title: book.nameLong,
            href: `/bibles/${bibleId}/books/${bookId}`,
          },
        ]}
      />
      <div className="flex flex-col">
        <Title page="Book" title={`${book.nameLong} (${book.id})`} />
        <div className="font-light">{book.chapters.length} chapters</div>
      </div>

      <div className="flex gap-4">
        <LinkButton
          title="View Chapters"
          href={`/bibles/${bibleId}/books/${bookId}/chapters`}
        >
          <BookIcon size={16} />
        </LinkButton>

        <LinkButton
          title="View Sections"
          href={`/bibles/${bibleId}/books/${bookId}/sections`}
        >
          <BookIcon size={16} />
        </LinkButton>
      </div>
    </div>
  );
}
