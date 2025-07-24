import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { ComboBoxResponsive } from "./ResponsiveCombobox";

interface ExpenseFormProps {
  expense?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExpenseForm({ expense, onClose, onSuccess }: ExpenseFormProps) {
  const [date, setDate] = useState(
    expense?.date || new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(
    expense ? (expense.amount / 100).toString() : ""
  );
  const [notes, setNotes] = useState(expense?.notes || "");
  const [category, setCategory] = useState(expense?.category || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useQuery(api.expenseCategories.getExpenseCategories);
  const createExpense = useMutation(api.expenses.createExpense);
  const updateExpense = useMutation(api.expenses.updateExpense);

  // const allCategories = Array.from(
  //   new Set([...commonCategories, ...(categories || [])])
  // ).sort();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      if (expense) {
        await updateExpense({
          expenseId: expense._id,
          date,
          description: description.trim(),
          amount: amountValue,
          notes: notes.trim() || undefined,
          category: category.trim() || undefined,
        });
        toast.success("Expense updated");
      } else {
        await createExpense({
          date,
          description: description.trim(),
          amount: amountValue,
          notes: notes.trim() || undefined,
          category: category.trim() || undefined,
        });
        toast.success("Expense added");
      }
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save expense"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {expense ? "Edit Expense" : "Add Expense"}
            </h2>
            <button onClick={onClose} className="btn-ghost h-8 w-8 p-0">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label htmlFor="date" className="text-sm font-medium mb-2 block">
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium mb-2 block"
              >
                Description *
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                placeholder="What was this expense for?"
                required
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="text-sm font-medium mb-2 block"
              >
                Amount * ($)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <ComboBoxResponsive
                selectedOption={category}
                setSelectedOption={setCategory}
                options={categories || []}
              />
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Additional notes (optional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline h-10 px-4 py-2 flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary h-10 px-4 py-2 flex-1"
              >
                {isSubmitting ? "Saving..." : expense ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
