import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { LinkButton } from "@/components/LinkButton";
import { TextSection } from "@/components/sections/TextSection";
import { BookOpenText } from "lucide-react";
import Link from "next/link";
import { cacheLife } from "next/cache";

/**
 * Home page of the application. */
export default async function HomePage() {
  "use cache";
  cacheLife("max");

  return (
    <div className="flex flex-col">
      <HeaderSection
        title="API.Bible NextJS Demo"
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
          },
        ]}
      />
      <InfoSection
        title="What is API.Bible?"
        url="https://api.bible"
        info={
          <>
            <p className="text-sm">
              API.Bible is a tool for developers that{" "}
              <b>provides access to a massive catalog of Bibles</b>, including
              popular translations like NIV, NKJV, NASB, The Message, CST, NLT,
              The Amplified Bible, GNT, and more,{" "}
              <b>through a fully-fledged API.</b>
            </p>
            <p className="text-sm mt-2">
              Historically, licensing Bibles has been a difficult and
              time-consuming process that had to be repeated for every
              translation required. API.Bible solves this hurdle for digital
              Bible use. We have collaborated with dozens of IP holders and
              gathered a massive catalogue of open access Bibles to provide you
              with{" "}
              <b>
                everything you need to get the Bible into your app, all under a
                single license.
              </b>
            </p>
          </>
        }
      />
      <TextSection>
        <h3 className="text-2xl font-bold">WELCOME.</h3>
        <p>
          Welcome to the API.Bible NextJS Demo application! This app was built
          to be a tool you can use to see in real-time how our API functions.
          The URL structure is intended to match that of our API to help you get
          familiar with how Bible data is queried. Along with the accompanying
          API results, each page will include a quick guide to querying the data
          that is being shown. If you want more details about our platform, be
          sure to check out our{" "}
          <Link href="https://docs.api.bible" className="underline">
            documentation
          </Link>
          .
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
        <div className="w-full flex justify-center mt-8">
          <LinkButton
            title="Expore the Demo"
            href="/bibles"
            className="border-[1px] text-lg gap-4"
          >
            <BookOpenText size={16} />
          </LinkButton>
        </div>
      </TextSection>
    </div>
  );
}
