import { Info } from "lucide-react";
import { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  url?: string;
  info: ReactNode;
};

/**
 * Renders a card containing "help" text, used to provide extra information to the user
 * about the page they are currently visiting.
 */
export const InfoSection = ({ title, info, url }: InfoCardProps) => {
  return (
    <div className="bg-black text-white w-full p-4 flex gap-2">
      <div className="w-[16px] mr-2">
        <Info size={16} className="mt-[5px]" />
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="font-bold">{title}</h5>
        {!!url && <code className="mb-2 font-bold text-zinc-400">{url}</code>}
        {info}
      </div>
    </div>
  );
};
