import { cn } from "@/lib/utils";

type PageIntroProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageIntro({
  title,
  description,
  children,
  className,
}: PageIntroProps) {
  return (
    <div className={cn("mb-8 space-y-4", className)}>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
