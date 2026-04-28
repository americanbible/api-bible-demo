"use client";

import { BookOpenText, Check, Copy } from "lucide-react";
import { ReactNode, useState } from "react";

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
  const [copied, setCopied] = useState(false);
  const onUrlCopy = async () => {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };
  return (
    <div className="bg-black text-white w-full px-4 py-12 flex gap-2">
      <div className="w-[16px] mr-2">
        <BookOpenText size={16} className="mt-[5px]" />
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="font-bold">{title}</h5>
        {!!url && (
          <div className="w-full flex gap-2 overflow-hidden">
            <div className="w-[16px] mt-[5px]" title="Copy to Clipboard">
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy
                  size={16}
                  className="cursor-pointer"
                  onClick={onUrlCopy}
                />
              )}
            </div>
            <code className="mb-2 font-bold text-zinc-400 break-all">
              {url}
            </code>
          </div>
        )}
        {info}
      </div>
    </div>
  );
};
