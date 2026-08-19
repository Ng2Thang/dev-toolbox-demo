type ToolPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ToolPageHeader({ eyebrow, title, description }: ToolPageHeaderProps) {
  return (
    <div className="page-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
