// src/components/layout/Collapsible.tsx
// Reusable accordion: hides content behind an arrow toggle.
// Keeps dense dashboards neat by tucking secondary information away.
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  icon,
  defaultOpen = false,
  className,
  children,
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div
      className={`border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col ${className ?? ''}`}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-left bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-brand/50"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className="font-semibold text-[10px] text-navy-800 tracking-wider uppercase">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-height-[2000px]' : 'max-height-0'
        }`}
        style={{ maxHeight: open ? 2000 : 0 }}
      >
        <div className="px-3 pb-3 pt-1">{children}</div>
      </div>
    </div>
  );
};
