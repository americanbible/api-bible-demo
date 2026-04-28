import { Page } from "@/components/Page";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import { Bible, Chapter, Verse } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";

type VersesListPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

/**
 * Verses list page. Renders the full list of verses for the given chapter of the Bible.
 *
 * See our [Verses Guide](https://docs.api.bible/guides/verses) for more.
 */
export default async function VersesListPage(props: VersesListPageProps) {
  const { bibleId, chapterId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  //Fetch a single chapter from the `/bibles/{bibleId}/chapters/{chapterId}` endpoint
  const chapter = await makeCachedApiRequest<Chapter>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}`,
  });
  //Fetch full list of verses for the given chapter from the `/bibles/{bibleId}/chapters/{chapterId}/verses` endpoint
  const verses = await makeCachedApiRequest<Verse[]>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}/verses`,
  });

  return (
    <Page>
      <HeaderSection
        bible={bible}
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Bibles",
            href: "/bibles",
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
            title: "Verses",
            href: `/bibles/${bibleId}/chapters/${chapter.id}/verses`,
          },
        ]}
      />
      <InfoSection
        title="Fetching Verses in a Chapter"
        url="https://rest.api.bible/v1/bibles/{bibleId}/chapters/{chapterId}/verses"
        info={
          <>
            <p className="mb-2">
              To fetch a list of verses for a chapter of the Bible, you must
              send a <code className="font-bold">GET</code> request to the above
              API endpoint using the <b>Bible ID</b> and <b>Chapter ID</b> you
              would like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/verses"
                className="underline"
              >
                Verses Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: You may also use the{" "}
              <code className="font-bold">/chapters</code> endpoint to fetch
              verse data. For more, see our guide on{" "}
              <Link
                href="https://docs.api.bible/guides/chapters#fetching-a-list-of-chapters-for-a-book"
                className="underline"
              >
                Fetching a List of Chapters for a Book
              </Link>
              .
            </p>
          </>
        }
      />
      <ListSection
        title="Verses"
        items={verses.map((verse) => ({
          title: <p className="font-bold">{verse.reference}</p>,
          info: verse.id,
          href: `/bibles/${bibleId}/verses/${verse.id}`,
        }))}
      />
    </Page>
  );
}
