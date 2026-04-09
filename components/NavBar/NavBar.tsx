import Link from "next/link";
import Image from "next/image";
import { NavItem } from "./NavItem";

export const Navbar = () => {
  return (
    <nav className="relative flex items-center justify-between p-0 shrink-0">
      <div className="flex items-center justify-between w-full min-h-[38px]">
        <div className="flex items-center justify-start w-full">
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

          <div className="flex gap-5 shrink-0">
            <div className="flex items-start gap-4">
              <NavItem href="/" isActive>
                Demo
              </NavItem>
              <NavItem href="https://docs.api.bible">Docs</NavItem>
              <NavItem href="https://api.bible/api-reference">
                API Reference
              </NavItem>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
