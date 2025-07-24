import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { api } from "../../../convex/_generated/api";
import { Calendar23 } from "../Calenar23";
import { ComboBoxResponsive } from "../ResponsiveCombobox";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFiltersQueryState } from "./useFiltersQueryState";

const DataFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [minAmountValue, setMinAmountValue] = useState("");
  const [maxAmountValue, setMaxAmountValue] = useState("");

  const categories = useQuery(api.expenseCategories.getExpenseCategories);
  const { filters, setFilters } = useFiltersQueryState();

  // Sync local state with filters on mount and when filters change
  useEffect(() => {
    setSearchValue(filters.search || "");
    setMinAmountValue(filters.minAmount?.toString() || "");
    setMaxAmountValue(filters.maxAmount?.toString() || "");
    setSelectedCategory(filters.category || null);

    // Set date range if filters have dates
    if (filters.startDate || filters.endDate) {
      setDateRange({
        from: filters.startDate || undefined,
        to: filters.endDate || undefined,
      });
    } else {
      setDateRange(undefined);
    }
  }, [filters]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await setFilters({
      search: searchValue,
      startDate: dateRange?.from || null,
      endDate: dateRange?.to || null,
      minAmount: parseFloat(minAmountValue) || null,
      maxAmount: parseFloat(maxAmountValue) || null,
      category: selectedCategory || "",
    });
  };

  const handleReset = async () => {
    await setFilters({
      search: "",
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
      category: "",
    });
    // Local state will be updated via useEffect when filters change
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters & Search</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          onSubmit={handleSubmit}
        >
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              name="search"
              type="text"
              placeholder="Search description or notes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Calendar23 range={dateRange} setRange={setDateRange} />
          {/* Amount Range */}
          <div className="space-y-2">
            <Label>Amount Range</Label>
            <div className="flex items-center gap-2">
              <Input
                name="minAmount"
                type="number"
                step="0.01"
                placeholder="Min ($)"
                value={minAmountValue}
                onChange={(e) => setMinAmountValue(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                name="maxAmount"
                type="number"
                step="0.01"
                placeholder="Max ($)"
                value={maxAmountValue}
                onChange={(e) => setMaxAmountValue(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <ComboBoxResponsive
              selectedOption={selectedCategory}
              setSelectedOption={setSelectedCategory}
              options={categories ?? []}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end justify-end gap-3 md:col-span-2 lg:col-span-3">
            <Button type="button" variant="outline" onClick={handleReset}>
              Clear Filters
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataFilters;
