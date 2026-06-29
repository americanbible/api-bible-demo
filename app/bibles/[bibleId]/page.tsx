import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { JSONSection } from "@/components/sections/JSONSection";
import { Book, BookText, Search } from "lucide-react";
import Link from "next/link";
import { Page } from "@/components/Page";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";

type BiblePageProps = {
  params: Promise<{ bibleId: string }>;
};

/**
 * Single Bible page. Renders resulting Bible content as JSON.
 *
 * See our [Bibles Guide](https://docs.api.bible/guides/bibles) for more.
 */
export default async function BiblePage(props: BiblePageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<PageLoader />}>
      <CachedBiblePage {...params} />
    </Suspense>
  );
}

async function CachedBiblePage({ bibleId }: Awaited<BiblePageProps["params"]>) {
  "use cache";
  cacheLife("max");

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);

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
        ]}
        actionItems={[
          {
            title: "View Books",
            href: `/bibles/${bible.id}/books`,
            children: <Book size={16} />,
          },
          {
            title: "Find Passages",
            href: `/bibles/${bible.id}/passages`,
            children: <BookText size={16} />,
          },
          {
            title: "Search",
            href: `/bibles/${bible.id}/search`,
            children: <Search size={16} />,
          },
        ]}
      />
      <InfoSection
        title="Fetching Bible Info"
        url="https://rest.api.bible/v1/bibles/{bibleId}"
        info={
          <>
            <p className="mb-2">
              To fetch information about a single Bible, you must send a{" "}
              <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> of the Bible you would like to
              fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/bibles"
                className="underline"
              >
                Bibles Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: If you are having trouble finding the <b>Bible ID</b> of a
              specific Bible, try{" "}
              <Link
                href="https://docs.api.bible/guides/bibles#fetching-your-available-bibles"
                className="underline"
              >
                fetching your available Bibles
              </Link>{" "}
              first.
            </p>
          </>
        }
      />

      <JSONSection json={bible} />
    </Page>
  );
}
