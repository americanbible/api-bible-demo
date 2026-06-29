import { Page } from "@/components/Page";
import PageLoader from "@/components/PageLoader";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { VerseContentSection } from "@/components/sections/VerseContentSection";
import { client } from "@/utils/api";
import { BookText } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PassagePageProps = {
  params: Promise<{ bibleId: string; passageId: string }>;
};

/**
 * Single passage page. Renders resulting passage verse content.
 *
 * See our [Passages Guide](https://docs.api.bible/guides/passages) for more.
 */
export default async function PassagePage(props: PassagePageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<PageLoader />}>
      <CachedPassagePage {...params} />
    </Suspense>
  );
}

async function CachedPassagePage({
  bibleId,
  passageId,
}: Awaited<PassagePageProps["params"]>) {
  "use cache";
  cacheLife("max");

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single passage from the `/bibles/{bibleId}/passages/{passageId}` endpoint
  const { data: passage } = await client.passages.get(bibleId, passageId, {
    contentType: "html",
    includeVerseSpans: true,
  });

  if (!passage) {
    notFound();
  }

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
            title: "Passages",
            href: `/bibles/${bibleId}/passages`,
          },
          {
            title: passage.reference!,
            href: `/bibles/${bibleId}/passages/${passage.id}`,
          },
        ]}
        actionItems={[
          {
            title: "Find Another Passage",
            href: `/bibles/${bibleId}/passages`,
            children: <BookText size={16} />,
          },
        ]}
      />
      <InfoSection
        title="Fetching a Passage"
        url="https://rest.api.bible/v1/bibles/{bibleId}/passages/{passageId}"
        info={
          <>
            <p className="mb-2">
              To fetch a passage in Bible, you must send a GET request to the
              above API endpoint using the appropriate <b>Bible ID</b> and
              <b>Passage ID</b> you would like to fetch. For more information,
              check out our{" "}
              <Link
                href="https://docs.api.bible/guides/passages"
                className="underline"
              >
                Passages Guide.
              </Link>{" "}
              While a <b>Passage ID</b> can span both chapters and books, the
              API will only return the <i>first 200 verses of the result</i>. In
              this instance, the truncated result will be reflectd in the{" "}
              <code className="font-bold">id</code> field, which will show the
              verse range actually returned. This means that large passages may
              need to be broken up into smaller chunks to successfully fetch
              them in their entirety from the API.
            </p>
            <p className="text-sm">
              Tip: This endpoint will also return verse content within the{" "}
              <code className="font-bold">content</code> field. Verse content
              can be configured based on the given input parameters, see our{" "}
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

      <VerseContentSection
        title={passage.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        verseContent={passage as any}
      />
    </Page>
  );
}
