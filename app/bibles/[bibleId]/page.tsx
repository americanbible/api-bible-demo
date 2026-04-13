import { ActionList } from "@/components/ActionList";
import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";
import { JSONContent } from "@/components/JSONContent";
import { LinkButton } from "@/components/LinkButton";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { Book, BookText, Search } from "lucide-react";
import Link from "next/link";

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
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title="Bible Info"
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: bible.name,
            href: `/bibles/${bibleId}`,
          },
        ]}
      />
      <InfoCard
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

      <ActionList>
        <LinkButton title="View Books" href={`/bibles/${bible.id}/books`}>
          <Book size={16} />
        </LinkButton>
        <LinkButton title="Find Passages" href={`/bibles/${bible.id}/passages`}>
          <BookText size={16} />
        </LinkButton>
        <LinkButton title="Search" href={`/bibles/${bible.id}/search`}>
          <Search size={16} />
        </LinkButton>
      </ActionList>

      <JSONContent json={bible} />
    </div>
  );
}
