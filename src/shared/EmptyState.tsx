interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] gap-4 text-center p-8">
      {icon && <div className="text-TEXT-ALT text-6xl opacity-50">{icon}</div>}
      <div className="flex flex-col gap-2">
        <h3 className="text-TEXT-MAIN text-TITLE-4 font-medium">{title}</h3>
        {description && <p className="text-TEXT-ALT text-SUBTITLE-4 max-w-md">{description}</p>}
      </div>
    </div>
  );
};
