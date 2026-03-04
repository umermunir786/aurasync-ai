import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  leftLabel, 
  rightLabel,
  className 
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-3">
        {leftLabel && (
          <span className={cn(
            "text-xs font-medium transition-colors",
            !checked ? "text-indigo-400" : "text-slate-500"
          )}>
            {leftLabel}
          </span>
        )}
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-950",
            checked ? "bg-indigo-600" : "bg-slate-700"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
        {rightLabel && (
          <span className={cn(
            "text-xs font-medium transition-colors",
            checked ? "text-indigo-400" : "text-slate-500"
          )}>
            {rightLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default Switch;
