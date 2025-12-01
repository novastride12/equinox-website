interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 h-px w-24 mx-auto bg-slate-700" />
    </div>
  );
};

export default SectionHeader;
