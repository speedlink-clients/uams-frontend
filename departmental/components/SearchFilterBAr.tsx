// components/SearchFilterBar.tsx
import React from "react";
import { Search, X } from "lucide-react";

interface FilterConfig {
  key: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  defaultLabel?: string;
  className?: string;
}

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters?: FilterConfig[];
  onClearFilters: () => void;
  // Deprecated/Legacy props (optional for backward compat if needed, but we are updating usages)
  selectedFilter?: string;
  setSelectedFilter?: (filter: string) => void;
  filterOptions?: string[];
  defaultFilterLabel?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filters = [],
  onClearFilters,
  // Legacy handling
  selectedFilter,
  setSelectedFilter,
  filterOptions,
  defaultFilterLabel,
}) => {
  // Normalize filters: use provided filters or convert legacy props
  const activeFilters = filters.length > 0 
    ? filters 
    : (selectedFilter && setSelectedFilter && filterOptions) 
      ? [{
          key: "legacy-filter",
          value: selectedFilter,
          onChange: setSelectedFilter,
          options: filterOptions,
          defaultLabel: defaultFilterLabel || "All Items"
        }]
      : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, email or student ID"
            className="bg-white border border-slate-200 text-xs py-2 pl-10 pr-3 rounded-lg outline-none w-full focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {activeFilters.map((filter) => (
            <select
              key={filter.key}
              className={`px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${filter.className || ""}`}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? (filter.defaultLabel || "All") : option}
                </option>
              ))}
            </select>
          ))}

          <button
            className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            onClick={onClearFilters}
          >
            <X size={16} className="text-slate-800" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
