import { BookOpenText } from "lucide-react";
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
export const InfoCard = ({ title, info, url }: InfoCardProps) => {
  return (
    <div className="bg-zinc-100 border-zinc-500 border-1 rounded-md w-full p-4 flex gap-2">
      <div className="w-[16px]">
        <BookOpenText size={16} className="mt-[5px]" />
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="font-bold">{title}</h5>
        {!!url && <code className="mb-2 font-bold text-zinc-600">{url}</code>}
        {info}
      </div>
    </div>
  );
};
