import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";

export default async function HomePage() {
  const bibles = await makeCachedApiRequest<Bible[]>({ endpoint: "/bibles" });
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-100 border-zinc-500 border-1 rounded-md w-full p-8 flex flex-col gap-2">
        <h2 className="text-2xl font-bold mb-2">API.Bible NextJS Demo</h2>
        <p>
          Welcome to the API.Bible NextJS Demo application! This app was built
          to be a tool you can use to see in real-time how our API functions.
          The URL structure is intended to match that of our API to help you get
          familiar with how our data can be used. Click a Bible below to get
          started.
        </p>
        <p className="text-sm">
          If you are interested in seeing how this application is built, check
          out our public{" "}
          <Link
            href="https://github.com/americanbible/api-bible-demo"
            className="underline"
          >
            GitHub repository
          </Link>
          .
        </p>
      </div>

      <Title page="Bibles" title={`All (${bibles.length})`} />

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
      <div className="flex flex-col gap-2">
        {bibles.map((bible) => (
          <div className="flex flex-col gap-1" key={bible.id}>
            <p>
              {bible.name} ({bible.abbreviation})
            </p>
            <Link href={`/bibles/${bible.id}`} className="pl-2">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
