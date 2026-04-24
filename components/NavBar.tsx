import Link from "next/link";
import Image from "next/image";
import { LinkButton } from "./LinkButton";
import { Spacer } from "./Spacer";

/**
 * API.Bible nav bar that includes links to other helpful pages
 */
export const Navbar = () => {
  return (
    <nav className="w-full border-black border-b-[1px]">
      <div className="w-full flex items-stretch justify-between">
        <div className="flex items-center px-4">
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

        <div className="flex">
          <div className="h-full flex flex-col border-l-[1px]">
            <ButtonSpacer />
            <div>
              <LinkButton
                title="View Source Code"
                href="https://github.com/americanbible/api-bible-demo"
                className="text-sm border-y-[1px] h-auto"
                external
              />
            </div>
            <ButtonSpacer />
          </div>
          <div className="h-full flex flex-col border-l-[1px]">
            <ButtonSpacer />
            <div>
              <LinkButton
                title="View Docs"
                href="https://docs.api.bible"
                className="text-sm border-y-[1px] h-auto"
                external
              />
            </div>
            <ButtonSpacer />
          </div>
          <div className="h-full flex flex-col border-l-[1px]">
            <ButtonSpacer />
            <div>
              <LinkButton
                title="Visit API.Bible"
                href="https://api.bible"
                className="text-sm border-y-[1px] h-auto"
                external
              />
            </div>
            <ButtonSpacer />
          </div>
          <Spacer border="l" />
        </div>
      </div>
    </nav>
  );
};

const ButtonSpacer = () => {
  return <div className="h-[18px] w-full" />;
};
