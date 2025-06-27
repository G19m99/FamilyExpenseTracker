import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function UserManagement() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const members = useQuery(api.families.getFamilyMembers);
  const inviteUser = useMutation(api.families.inviteUser);
  const removeMember = useMutation(api.families.removeMember);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!validateEmail(inviteEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsInviting(true);
    try {
      await inviteUser({ email: inviteEmail.trim() });
      toast.success("Invitation sent successfully");
      setInviteEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (memberId: Id<"familyMembers">, userName: string) => {
    if (confirm(`Are you sure you want to remove ${userName} from the family?`)) {
      try {
        await removeMember({ memberId });
        toast.success("Member removed successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to remove member");
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (members === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite User */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
        
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            className="input flex-1"
            required
          />
          <button
            type="submit"
            disabled={isInviting}
            className="btn-primary h-10 px-4 py-2 whitespace-nowrap"
          >
            {isInviting ? "Sending..." : "Send Invite"}
          </button>
        </form>
      </div>

      {/* Members List */}
      <div className="card">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Family Members</h3>
        </div>
        
        <div className="divide-y">
          {members.map((member) => (
            <div key={member._id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-base">
                      {member.user?.name || member.user?.email}
                    </h4>
                    <span
                      className={`badge ${
                        member.role === "admin"
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                          : "badge-secondary"
                      }`}
                    >
                      {member.role}
                    </span>
                    <span
                      className={`badge ${
                        member.status === "active"
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                          : member.status === "invited"
                          ? "bg-gray-600 text-white dark:bg-gray-400 dark:text-gray-900"
                          : "bg-gray-400 text-white dark:bg-gray-600 dark:text-white"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-1">
                    {member.user?.email}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {member.status === "active" && member.joinedAt && (
                      <span>Joined {formatDate(member.joinedAt)}</span>
                    )}
                    {member.status === "invited" && member.invitedAt && (
                      <span>Invited {formatDate(member.invitedAt)}</span>
                    )}
                  </div>
                </div>

                {member.status === "active" && member.role !== "admin" && (
                  <button
                    onClick={() => handleRemove(member._id, member.user?.name || member.user?.email || "User")}
                    className="btn-outline h-9 px-3 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
