import { Page } from "@/components/Page";
import PageLoader from "@/components/PageLoader";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

type SectionsListPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

/**
 * Sections list page. Renders the full list of sections for the given chapter of the Bible.
 *
 * See our [Sections Guide](https://docs.api.bible/guides/sections) for more.
 */
export default async function SectionsListPage(props: SectionsListPageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<PageLoader />}>
      <CachedSectionsListPage {...params} />
    </Suspense>
  );
}

async function CachedSectionsListPage({
  bibleId,
  chapterId,
}: Awaited<SectionsListPageProps["params"]>) {
  "use cache";
  cacheLife("max");

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single chapter from the `/bibles/{bibleId}/chapters/{chapterId}` endpoint
  const { data: chapter } = await client.chapters.get(bibleId, chapterId);
  //Fetch full list of sections (if they exist) for the given chapter from the `/bibles/{bibleId}/chapters/{chapterId}/sections` endpoint
  const { data: sections } = await client.sections
    .listForChapter(bibleId, chapterId)
    .catch(() => ({ data: [] }));

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
            title: chapter.reference!,
            href: `/bibles/${bibleId}/chapters/${chapter.id}`,
          },
          {
            title: "Sections",
            href: `/bibles/${bibleId}/chapters/${chapter.id}/sections`,
          },
        ]}
      />

      <InfoSection
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
      <ListSection
        title="Sections"
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
    </Page>
  );
}
