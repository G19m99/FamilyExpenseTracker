import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExpenseList } from "./ExpenseList";
import { ExpenseForm } from "./ExpenseForm";
import { UserManagement } from "./UserManagement";

interface ExpenseTrackerProps {
  family: {
    family: any;
    membership: any;
  };
}

export function ExpenseTracker({ family }: ExpenseTrackerProps) {
  const [activeTab, setActiveTab] = useState<"expenses" | "users">("expenses");
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const isAdmin = family.membership.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{family.family.name}</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your family expenses
          </p>
        </div>
        
        {activeTab === "expenses" && (
          <button
            onClick={() => setShowExpenseForm(true)}
            className="btn-primary h-10 px-4 py-2"
          >
            + Add Expense
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "expenses"
                ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Expenses
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab("users")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "users"
                  ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Users
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "expenses" && (
        <ExpenseList />
      )}
      
      {activeTab === "users" && isAdmin && (
        <UserManagement />
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSuccess={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
}
