// Reusable input wrapper
export function FormField({ id, label, icon: Icon, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#191c1e] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon
            className={`w-[18px] h-[18px] ${error ? "text-[#ba1a1a]" : "text-[#6d7a73]"}`}
          />
        </div>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-[#ba1a1a]">{error}</p>}
    </div>
  );
}

export const inputBase = (hasError) =>
  `w-full pl-10 pr-4 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
    hasError
      ? "border-[#ba1a1a] focus:ring-[#ba1a1a]/20"
      : "border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30"
  }`;

export const inputWithToggle = (hasError) =>
  inputBase(hasError).replace("pr-4", "pr-11");
