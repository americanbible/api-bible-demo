import { Spacer } from "../Spacer";

type JSONContentProps = {
  json: object;
};

/**
 * Renders raw JSON content returned from the API
 */
export const JSONSection = ({ json }: JSONContentProps) => {
  return (
    <div className="w-full">
      <div className="h-9 w-full flex items-stretch">
        <Spacer />
        <p className="font-bold text-sm px-4 py-2">Raw JSON Output: </p>
      </div>
      <div className="p-4 bg-zinc-50 border-black border-y-1">
        <pre
          className="text-wrap"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json, null, 2) }}
        />
      </div>
    </div>
  );
};
