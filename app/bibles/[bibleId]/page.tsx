import { ActionSection } from "@/components/sections/ActionSection";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { JSONSection } from "@/components/sections/JSONSection";
import { BibleSection } from "@/components/sections/BibleSection";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { Book, BookText, Search } from "lucide-react";
import Link from "next/link";
import { Page } from "@/components/Page";

type BiblePageProps = {
  params: Promise<{ bibleId: string }>;
};

/**
 * Single Bible page. Renders resulting Bible content as JSON.
 *
 * See our [Bibles Guide](https://docs.api.bible/guides/bibles) for more.
 */
export default async function BiblePage(props: BiblePageProps) {
  const { bibleId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });

  return (
    <Page>
      <HeaderSection
        title="Bible Info"
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
      <BibleSection bible={bible} />

      <ActionSection
        items={[
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

      <JSONSection json={bible} />
    </Page>
  );
}
