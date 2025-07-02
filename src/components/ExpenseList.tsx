import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ExpenseForm } from "./ExpenseForm";
import { createColumnsDefs } from "./expenseTable/columns";
import DataFilters from "./expenseTable/DataFilters";
import DataTable from "./expenseTable/DataTable";
import { useFiltersQueryState } from "./expenseTable/useFiltersQueryState";

type Expense = FunctionReturnType<typeof api.expenses.getExpenses>[number];
type Expenses = FunctionReturnType<typeof api.expenses.getExpenses>;

export function ExpenseList() {
  const { filters } = useFiltersQueryState();
  const { search, startDate, endDate, minAmount, maxAmount, category } =
    filters;
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const expenses = useQuery(api.expenses.getExpenses, {
    search: search || undefined,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
    minAmount: minAmount ? minAmount * 100 : undefined,
    maxAmount: maxAmount ? maxAmount * 100 : undefined,
    category: category || undefined,
  });

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
    (expense: Expense) => setEditingExpense(expense),
    []
  );

  return (
    <div className="space-y-6">
      <DataFilters />
      <ExpensesView
        expenses={expenses}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
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

type ExpensesViewProps = {
  expenses: Expenses | undefined;
  handleEdit: (expense: Expense) => void;
  handleDelete: (expenseId: Id<"expenses">) => Promise<void>;
};

const ExpensesView = ({
  expenses,
  handleDelete,
  handleEdit,
}: ExpensesViewProps) => {
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

  const columns = useMemo(
    () => createColumnsDefs(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  if (expenses === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
