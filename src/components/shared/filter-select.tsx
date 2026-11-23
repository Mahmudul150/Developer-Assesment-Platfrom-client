"use client";

import { Select } from "@/components/ui/select";
import { useUrlState } from "@/hooks/use-url-state";

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterSelect({
  param,
  options,
  placeholder = "All",
}: {
  param: string;
  options: FilterOption[];
  placeholder?: string;
}) {
  const { get, setParams } = useUrlState();
  return (
    <Select
      aria-label={placeholder === "All" ? `Filter by ${param}` : placeholder}
      value={get(param) ?? ""}
      onChange={(event) =>
        setParams({ [param]: event.target.value || null, page: null })
      }
      className="w-full sm:w-44"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
