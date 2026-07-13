import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function AdminInput({ label, className, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      <input
        {...props}
        className={cn(
          "w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600",
          "focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/20 transition-all text-sm",
          className
        )}
      />
    </div>
  );
}

export function AdminTextarea({ label, className, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      <textarea
        {...props}
        className={cn(
          "w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600",
          "focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/20 transition-all text-sm resize-none",
          className
        )}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function AdminSelect({ label, options, className, ...props }: SelectProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      <select
        {...props}
        className={cn(
          "w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white",
          "focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/20 transition-all text-sm",
          className
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
