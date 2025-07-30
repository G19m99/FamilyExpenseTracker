import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import { AcceptInvitation } from "./components/AcceptInvitation";
import { ExpenseTracker } from "./components/ExpenseTracker";
import FamilySetup from "./components/FamilySetup";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Check for invitation token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const invitationToken = urlParams.get("invite-token");

  if (invitationToken) {
    return (
      <div className="min-h-screen bg-background">
        <AcceptInvitation token={invitationToken} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Authenticated>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Family Expenses</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="btn-ghost h-9 w-9 p-0"
                title={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <Authenticated>
                <SignOutButton />
              </Authenticated>
            </div>
          </div>
        </header>
      </Authenticated>
      <main className="mx-auto px-4 py-8 min-h-full h-[calc(100vh-65px)] overflow-y-auto">
        <Content />
      </main>

      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userFamily = useQuery(api.families.getCurrentUserFamily);

  if (loggedInUser === undefined || userFamily === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Authenticated>
        {userFamily ? <ExpenseTracker family={userFamily} /> : <FamilySetup />}
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </div>
  );
}
