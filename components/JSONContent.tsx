type JSONContentProps = {
  json: object;
};

/**
 * Renders raw JSON content returned from the API
 */
export const JSONContent = ({ json }: JSONContentProps) => {
  return (
    <div className="w-full">
      <p className="font-bold text-sm">Raw JSON Output: </p>
      <div className="p-4 bg-zinc-50 rounded border-zinc-100 border-1">
        <pre
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json, null, 2) }}
        />
      </div>
    </div>
  );
};
