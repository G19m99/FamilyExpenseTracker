import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { SignInForm } from "../SignInForm";

interface AcceptInvitationProps {
  token: string;
}

export function AcceptInvitation({ token }: AcceptInvitationProps) {
  const invitation = useQuery(api.invitations.getInvitationByToken, { token });
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const acceptInvitation = useMutation(api.invitations.acceptInvitation);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    if (!loggedInUser) return;
    
    setIsAccepting(true);
    try {
      await acceptInvitation({ token });
      toast.success("Successfully joined the family!");
      // Clear the token from URL
      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
    } finally {
      setIsAccepting(false);
    }
  };

  if (invitation === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
          <p className="text-muted-foreground">
            This invitation link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Join {invitation.family?.name}</h2>
          <p className="text-muted-foreground mt-2">
            You've been invited by {invitation.invitedBy?.name || invitation.invitedBy?.email}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please sign in to accept this invitation
          </p>
        </div>
        <SignInForm />
      </div>
    );
  }

  if (loggedInUser.email !== invitation.email) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Wrong Account</h2>
          <p className="text-muted-foreground">
            This invitation is for {invitation.email}, but you're signed in as {loggedInUser.email}.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please sign in with the correct account or ask for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Join {invitation.family?.name}</h2>
        <p className="text-muted-foreground mb-6">
          You've been invited by {invitation.invitedBy?.name || invitation.invitedBy?.email} to join their family expense tracker.
        </p>
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="btn-primary h-10 px-4 py-2 w-full"
        >
          {isAccepting ? "Joining..." : "Accept Invitation"}
        </button>
      </div>
    </div>
  );
}
