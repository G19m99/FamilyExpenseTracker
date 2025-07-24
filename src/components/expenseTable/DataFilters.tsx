import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFiltersQueryState } from "./useFiltersQueryState";

const DataFilters = () => {
  const categories = useQuery(api.expenseCategories.getExpenseCategories);
  const { filters, setFilters } = useFiltersQueryState();
  const { search, startDate, endDate, minAmount, maxAmount, category } =
    filters;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const startDateValue = fd.get("startDate");
    const endDateValue = fd.get("endDate");

    await setFilters({
      search: fd.get("search") as string,
      startDate: startDateValue ? new Date(startDateValue as string) : null,
      endDate: endDateValue ? new Date(endDateValue as string) : null,
      minAmount: fd.get("minAmount")
        ? parseFloat(fd.get("minAmount") as string)
        : null,
      maxAmount: fd.get("maxAmount")
        ? parseFloat(fd.get("maxAmount") as string)
        : null,
      category: fd.get("category") as string,
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
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Filters & Search</h3>
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div>
          <Label className="text-sm font-medium mb-2 block">Search</Label>
          <Input
            type="text"
            name="search"
            placeholder="Search description or notes..."
            defaultValue={search}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Start Date</Label>
          <Input
            type="date"
            name="startDate"
            defaultValue={startDate ? startDate.toISOString().slice(0, 10) : ""}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">End Date</Label>
          <Input
            type="date"
            name="endDate"
            defaultValue={endDate ? endDate.toISOString().slice(0, 10) : ""}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Min Amount</Label>
          <Input
            type="number"
            step="0.01"
            name="minAmount"
            placeholder="0.00"
            defaultValue={minAmount != null ? minAmount.toString() : ""}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Max Amount</Label>
          <Input
            type="number"
            step="0.01"
            name="maxAmount"
            placeholder="0.00"
            defaultValue={maxAmount != null ? maxAmount.toString() : ""}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Category</Label>
          <select name="category" defaultValue={category}>
            <option value="">All categories</option>
            {categories?.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end gap-3 md:col-span-2 lg:col-span-3">
          <Button type="reset" variant={"outline"} onClick={handleReset}>
            Clear
          </Button>
          <Button type="submit">Search</Button>
        </div>
      </form>
    </div>
  );
};

export default DataFilters;
