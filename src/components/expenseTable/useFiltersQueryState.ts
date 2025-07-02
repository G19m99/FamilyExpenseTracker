import {
  parseAsFloat,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";

export function useFiltersQueryState() {
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      startDate: parseAsIsoDateTime,
      endDate: parseAsIsoDateTime,
      minAmount: parseAsFloat,
      maxAmount: parseAsFloat,
      category: parseAsString.withDefault(""),
    },
    {
      history: "push", // Each change creates a browser history entry
      shallow: true, // Don’t re-fetch server data by default
      throttleMs: 200, // throttle updates to 200ms
    }
  );

  return { filters, setFilters };
}
