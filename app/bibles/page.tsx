import { Page } from "@/components/Page";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import { client } from "@/utils/api";
import { demoBibles } from "@/utils/demoBibles";
import Link from "next/link";

export const dynamic = "force-static";

/**
 * Bibles page of the application. Provides the list of Bibles this application has access to.
 * The full list of demo bibles can  be found in [demoBibles.ts](../utils/demoBibles.ts).
 *
 * See our [Bibles Guide](https://docs.api.bible/guides/bibles) for more.
 */
export default async function BiblesPage() {
  //Fetch bibles from the `/bibles` endpoint
  const { data: bibles } = await client.bibles.list({
    ids: demoBibles,
  });

  return (
    <Page>
      <HeaderSection
        title="Available Bibles"
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Bibles",
            href: "/bibles",
          },
        ]}
      />
      <InfoSection
        title="Fetching Your Available Bibles"
        url="https://rest.api.bible/v1/bibles"
        info={
          <>
            <p className="mb-2">
              To fetch your list of available Bibles, you must send a{" "}
              <code className="font-bold">GET</code> request to the above API
              endpoint. This will return a list of every Bible you have access
              to via API.Bible. This includes all Public Domain and Creative
              Commons versions, as well as any Bibles licensed through a{" "}
              <b>Pro Plan</b> subscription. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/bibles"
                className="underline"
              >
                Bibles Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: Bible availability via API.Bible depends on your chosen plan.
              The <b>Starter Plan</b> provides access to Public Domain and
              Creative Commons versions, while the <b>Pro Plan</b> may include
              additional licensed translations. See our{" "}
              <Link href="https://api.bible/bibles" className="underline">
                Bible Versions Table.
              </Link>{" "}
              for more information.
            </p>
          </>
        }
      />

      <ListSection
        title="Bibles"
        items={bibles.map((bible) => ({
          title: (
            <p>
              <span className="font-bold">{bible.name}</span> (
              {bible.abbreviation})
            </p>
          ),
          href: `/bibles/${bible.id}`,
          info: bible.id,
        }))}
      />
    </Page>
  );
}
