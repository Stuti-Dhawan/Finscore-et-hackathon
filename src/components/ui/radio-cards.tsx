import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface RadioCardsProps {
  options: RadioOption[];
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
}

export function RadioCards({ options, value, onChange, className }: RadioCardsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5",
              isSelected 
                ? "border-primary bg-primary/5 text-primary shadow-sm" 
                : "border-input bg-card text-foreground hover:border-primary/50 hover:bg-accent/5"
            )}
          >
            {opt.icon && <div className={cn("mb-2", isSelected ? "text-primary" : "text-muted-foreground")}>{opt.icon}</div>}
            <span className="font-semibold text-sm">{opt.label}</span>
          </button>
        );
      })}
    </div>
  )
}
