type TitleProps = {
  page: string;
  title: string;
};

export const Title = ({ page, title }: TitleProps) => {
  return (
    <h3 className="text-xl">
      <span className="font-bold">{page}: </span>
      {title}
    </h3>
  );
};
