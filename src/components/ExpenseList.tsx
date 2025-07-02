import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ExpenseForm } from "./ExpenseForm";
import DataTable from "./expenseTable/DataTable";
import { createColumnsDefs } from "./expenseTable/columns";

type Expenses = FunctionReturnType<typeof api.expenses.getExpenses>[number];

export function ExpenseList() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const expenses = useQuery(api.expenses.getExpenses, {
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    minAmount: minAmount ? parseFloat(minAmount) * 100 : undefined,
    maxAmount: maxAmount ? parseFloat(maxAmount) * 100 : undefined,
    category: category || undefined,
  });

  const categories = useQuery(api.expenses.getExpenseCategories);
  const deleteExpense = useMutation(api.expenses.deleteExpense);

  const handleDelete = useCallback(
    async (expenseId: Id<"expenses">) => {
      if (confirm("Are you sure you want to delete this expense?")) {
        try {
          await deleteExpense({ expenseId });
          toast.success("Expense deleted");
        } catch {
          toast.error("Failed to delete expense");
        }
      }
    },
    [deleteExpense]
  );

  const handleEdit = useCallback(
    (expense: Expenses) => setEditingExpense(expense),
    []
  );

  const columns = useMemo(
    () => createColumnsDefs(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const totalAmount = useMemo(() => {
    if (!expenses) return 0;
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  if (expenses === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Filters & Search</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or notes..."
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Min Amount</label>
            <input
              type="number"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.00"
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Max Amount</label>
            <input
              type="number"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="0.00"
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">All categories</option>
              {categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Expenses:</span>
          <span className="text-2xl font-bold">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {expenses.length} expense{expenses.length !== 1 ? "s" : ""} found
        </div>
      </div>
      <DataTable data={expenses} columns={columns} />
      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}
