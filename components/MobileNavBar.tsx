"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, XCircle } from "lucide-react";

interface MobileNavbarProps {
  children: ReactNode;
}

export const MobileNavbar = ({ children }: MobileNavbarProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflowY = "auto";
    setIsOpened(false);
  }, [pathname]);

  const handleToggle = () => {
    document.body.style.overflowY = isOpened ? "auto" : "hidden";
    setIsOpened(!isOpened);
  };

  return (
    <>
      {isOpened ? (
        <XCircle size={24} className="cursor-pointer" onClick={handleToggle} />
      ) : (
        <Menu size={24} className="cursor-pointer" onClick={handleToggle} />
      )}
      {isOpened && (
        <div
          key={pathname}
          className="absolute z-50 w-full h-screen left-0 top-12 px-4 py-4 bg-white/95 flex flex-col gap-5 border-b-2 border-gray overflow-hidden"
        >
          {children}
        </div>
      )}
    </>
  );
};
