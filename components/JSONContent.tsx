type JSONContentProps = {
  json: object;
};

export const JSONContent = ({ json }: JSONContentProps) => {
  return <div className="">{JSON.stringify(json)}</div>;
};
