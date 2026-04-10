import { ActionList } from "@/components/ActionList";
import { InfoCard } from "@/components/InfoCard";
import { LinkButton } from "@/components/LinkButton";
import { List } from "@/components/List";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { demoBibles } from "@/utils/demoBibles";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const bibles = await makeCachedApiRequest<Bible[]>({
    endpoint: "/bibles",
    //Only fetch demo bibles
    params: { ids: demoBibles.join(",") },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center mt-4">
        <h1 className="font-bold text-4xl">API.Bible NextJS Demo</h1>
      </div>
      <InfoCard
        title="Welcome!"
        info={
          <>
            <p>
              Welcome to the API.Bible NextJS Demo application! This app was
              built to be a tool you can use to see in real-time how our API
              functions. The URL structure is intended to match that of our API
              to help you get familiar with how Bible data is queried. Along
              with the accompanying API results, each page will include a quick
              guide to querying the data that is being shown. If you want more
              details about our platform, be sure to check out our{" "}
              <Link href="https://docs.api.bible" className="underline">
                documentation
              </Link>
              . Click a Bible below to get started.
            </p>
            <p className="text-sm mt-2">
              If you are interested in seeing how this application is built,
              check out our public{" "}
              <Link
                href="https://github.com/americanbible/api-bible-demo"
                className="underline"
              >
                GitHub repository
              </Link>
              .
            </p>
          </>
        }
      />

      <ActionList>
        <LinkButton
          title="View Docs"
          href="https://docs.api.bible"
          className="flex-row-reverse"
        >
          <SquareArrowOutUpRight size={12} className="ml-1" />
        </LinkButton>

        <LinkButton
          title="View Source Code"
          href="https://github.com/americanbible/api-bible-demo"
          className="flex-row-reverse"
        >
          <SquareArrowOutUpRight size={12} className="ml-1" />
        </LinkButton>

        <LinkButton
          title="Visit API.Bible"
          href="https://api.bible"
          className="flex-row-reverse"
        >
          <SquareArrowOutUpRight size={12} className="ml-1" />
        </LinkButton>
      </ActionList>

      <div className="flex gap-2 items-center mt-4">
        <h1 className="font-bold text-2xl">Available Bibles</h1>
        <h5 className="text-lg text-zinc-500 mt-[2px]">({bibles.length})</h5>
      </div>
      <InfoCard
        title="Fetching Your Available Bibles"
        url="https://rest.api.bible/v1/bibles"
        info={
          <>
            <p className="mb-2">
              o fetch your list of available Bibles, you must send a{" "}
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

      <List
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
    </div>
  );
}
