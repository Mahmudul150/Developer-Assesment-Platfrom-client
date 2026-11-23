"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlState } from "@/hooks/use-url-state";

export function SearchInput({
  param = "q",
  placeholder = "Search...",
}: {
  param?: string;
  placeholder?: string;
}) {
  const { searchParams, setParams } = useUrlState();
  const [value, setValue] = useState(searchParams.get(param) ?? "");
  const debounced = useDebounce(value);

  useEffect(() => {
    if (debounced !== (searchParams.get(param) ?? "")) {
      setParams({ [param]: debounced || null });
    }
  }, [debounced, param, searchParams, setParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
      />
    </div>
  );
}
