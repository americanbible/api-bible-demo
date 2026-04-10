import { Header } from "@/components/Header";
import { VerseContent } from "@/components/VerseContent";
import { LinkButton } from "@/components/LinkButton";
import { Bible, ChapterWithVerseContent } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { BookIcon, TextInitial } from "lucide-react";
import { ActionList } from "@/components/ActionList";
import Link from "next/link";
import { InfoCard } from "@/components/InfoCard";

type ChapterPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

export default async function ChapterPage(props: ChapterPageProps) {
  const { bibleId, chapterId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const chapter = await makeCachedApiRequest<ChapterWithVerseContent>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}`,
    params: {
      "content-type": "html",
      "include-verse-spans": "true",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title={chapter.reference}
        subtitle={chapter.id}
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: bible.name,
            href: `/bibles/${bibleId}`,
          },
          {
            title: "Chapters",
          },
          {
            title: chapter.reference,
            href: `/bibles/${bibleId}/chapters/${chapter.id}`,
          },
        ]}
      />

      <InfoCard
        title="Fetching a Single Chapter"
        url="https://rest.api.bible/v1/bibles/{bibleId}/chapters/{chapterId}"
        info={
          <>
            <p className="mb-2">
              To fetch information for a single chapter, you must send a{" "}
              <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> and <b>Chapter ID</b> you would
              like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/chapters"
                className="underline"
              >
                Chapters Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: In addition to information about the given chapter, this
              endpoint will also return all verse content included in that
              chapter within the <code className="font-bold">content</code>{" "}
              field. Verse content will be configured based on the given input
              parameters, see our{" "}
              <Link
                href="https://docs.api.bible/guides/verses#verse-content"
                className="underline"
              >
                Verse Content Guide
              </Link>{" "}
              for more.
            </p>
          </>
        }
      />
      <ActionList>
        <LinkButton
          title="View Verses"
          href={`/bibles/${bibleId}/chapters/${chapterId}/verses`}
        >
          <TextInitial size={16} />
        </LinkButton>

        <LinkButton
          title="View Sections"
          href={`/bibles/${bibleId}/chapters/${chapterId}/sections`}
        >
          <BookIcon size={16} />
        </LinkButton>
      </ActionList>

      <VerseContent
        linkBase={`/bibles/${bibleId}/chapters`}
        verseContent={chapter}
      />
    </div>
  );
}
