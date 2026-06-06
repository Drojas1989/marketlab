import type { HTMLInputTypeAttribute } from "react";

import { cn } from "@/lib/utils";

type AuthFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  required?: boolean;
  className?: string;
};

export function AuthField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  className,
}: AuthFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="field-input"
      />
    </div>
  );
}
