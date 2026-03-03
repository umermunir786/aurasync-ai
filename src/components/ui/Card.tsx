import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, glass = true, ...props }) => {
  return (
    <div 
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        glass ? "glass shadow-xl" : "bg-slate-900 border border-white/5 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
