import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { ExpenseForm } from "./ExpenseForm";

export function ExpenseList() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "description">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const expenses = useQuery(api.expenses.getExpenses, {
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    minAmount: minAmount ? parseFloat(minAmount) * 100 : undefined,
    maxAmount: maxAmount ? parseFloat(maxAmount) * 100 : undefined,
    category: category || undefined,
    sortBy,
    sortOrder,
  });

  const categories = useQuery(api.expenses.getExpenseCategories);
  const deleteExpense = useMutation(api.expenses.deleteExpense);

  const handleDelete = async (expenseId: Id<"expenses">) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense({ expenseId });
        toast.success("Expense deleted");
      } catch (error) {
        toast.error("Failed to delete expense");
      }
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input w-auto"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="description">Description</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="input w-auto"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Expenses:</span>
          <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {expenses.length} expense{expenses.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No expenses found</p>
            <p className="text-sm">Try adjusting your filters or add your first expense.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{expense.description}</h4>
                    {expense.category && (
                      <span className="badge badge-secondary w-fit">
                        {expense.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{formatDate(expense.date)}</span>
                    <span>by {expense.createdByUser?.name || expense.createdByUser?.email}</span>
                  </div>
                  
                  {expense.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{expense.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {formatCurrency(expense.amount)}
                  </span>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="btn-ghost h-9 w-9 p-0"
                      title="Edit expense"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="btn-ghost h-9 w-9 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete expense"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
