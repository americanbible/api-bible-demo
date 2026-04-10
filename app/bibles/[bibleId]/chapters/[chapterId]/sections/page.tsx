import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";
import { List } from "@/components/List";
import { Bible, Chapter, Section } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";

type SectionsListPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

export default async function SectionsListPage(props: SectionsListPageProps) {
  const { bibleId, chapterId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const chapter = await makeCachedApiRequest<Chapter>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}`,
  });
  const sections = await makeCachedApiRequest<Section[]>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}/sections`,
  }).catch(() => [] as Section[]);

  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title={`${chapter.reference} Sections`}
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
            title: chapter.reference,
            href: `/bibles/${bibleId}/chapters/${chapter.id}`,
          },
          {
            title: "Sections",
            href: `/bibles/${bibleId}/chapters/${chapter.id}/sections`,
          },
        ]}
      />

      <InfoCard
        title="Fetching Sections in a Chapter"
        url="https://rest.api.bible/v1/bibles/{bibleId}/chapters/{chapterId}/sections"
        info={
          <>
            <p className="mb-2">
              To fetch a list of sections for a chapter of the Bible, you must
              send a <code className="font-bold">GET</code> request to the above
              API endpoint using the <b>Bible ID</b> and <b>Chapter ID</b> you
              would like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/sections"
                className="underline"
              >
                Sections Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: Not every Bible has sections available. You can use the{" "}
              <code className="font-bold">/books</code> endpoint to check for
              section data using the{" "}
              <code className="font-bold">include-chapters-and-sections</code>{" "}
              query parameter. For more, see our guide on{" "}
              <Link
                href="https://docs.api.bible/guides/books#fetching-a-list-of-books-for-a-bible"
                className="underline"
              >
                Fetching a List of Books for a Bible
              </Link>
              .
            </p>
          </>
        }
      />
      <List
        items={sections.map((section) => ({
          title: (
            <p>
              <span className="font-bold">{section.title}</span> ({section.id})
            </p>
          ),
          href: `/bibles/${bibleId}/sections/${section.id}`,
          info: `${section.firstVerseId} - ${section.lastVerseId}`,
        }))}
      />
    </div>
  );
}
