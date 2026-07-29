export function AuthPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-[-0.035em] text-ink sm:text-[2rem]">
        {title}
      </h1>
      <p className="mt-2.5 max-w-md text-[0.95rem] leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}
