import Link from "next/link";
import Image from "next/image";
import { LinkButton } from "./LinkButton";

/**
 * API.Bible nav bar that includes links to other helpful pages
 */
export const Navbar = () => {
  return (
    <nav className="w-full border-black border-b-[1px] p-4">
      <div className="w-full flex items-stretch justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/assets/api-logo.svg"
              alt="API.Bible"
              className="mr-6 cursor-pointer w-[133px] min-w-[100px]"
              width={0}
              height={0}
              priority
            />
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          <LinkButton
            title="View Source Code"
            href="https://github.com/americanbible/api-bible-demo"
            className="text-sm border-[1px] h-auto"
            external
          />

          <LinkButton
            title="View Docs"
            href="https://docs.api.bible"
            className="text-sm border-[1px] h-auto"
            external
          />

          <LinkButton
            title="Visit API.Bible"
            href="https://api.bible"
            className="text-sm border-[1px] h-auto"
            external
          />
        </div>
      </div>
    </nav>
  );
};
