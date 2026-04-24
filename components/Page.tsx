import { ReactNode } from "react";

type PageProps = {
  children: ReactNode;
};

export const Page = ({ children }: PageProps) => {
  return <div className="w-full min-h-[100vh] flex flex-col">{children}</div>;
};
