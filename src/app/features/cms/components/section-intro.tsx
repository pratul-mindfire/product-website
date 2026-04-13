type SectionIntroProps = {
  description: string;
  title: string;
};

export function SectionIntro({ description, title }: SectionIntroProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
