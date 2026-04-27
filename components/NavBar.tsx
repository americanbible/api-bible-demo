import Link from "next/link";
import Image from "next/image";
import { LinkButton } from "./LinkButton";
import { MobileNavbar } from "./MobileNavBar";

/**
 * API.Bible nav bar that includes links to other helpful pages
 */
export const Navbar = () => {
  return (
    <nav className="relative w-full border-black border-b-[1px] p-4">
      <div className="w-full flex gap-2 items-stretch justify-between">
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

        <div className="hidden md:flex gap-2 sm:justify-center md:justify-end items-center">
          <LinkButton
            title="View Source Code"
            href="https://github.com/americanbible/api-bible-demo"
            className="text-sm border-[1px]"
            external
          />

          <LinkButton
            title="View Docs"
            href="https://docs.api.bible"
            className="text-sm border-[1px]"
            external
          />

          <LinkButton
            title="Visit API.Bible"
            href="https://api.bible"
            className="text-sm border-[1px]"
            external
          />
        </div>
        <div className="block md:hidden">
          <MobileNavbar>
            <div className="w-full p-4 flex flex-col sm:flex-row sm:justify-center gap-2">
              <LinkButton
                title="View Source Code"
                href="https://github.com/americanbible/api-bible-demo"
                className="text-sm border-[1px]"
                external
              />

              <LinkButton
                title="View Docs"
                href="https://docs.api.bible"
                className="text-sm border-[1px]"
                external
              />

              <LinkButton
                title="Visit API.Bible"
                href="https://api.bible"
                className="text-sm border-[1px]"
                external
              />
            </div>
          </MobileNavbar>
        </div>
      </div>
    </nav>
  );
};
