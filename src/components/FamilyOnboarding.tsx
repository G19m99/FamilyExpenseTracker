import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ArrowLeft, Plus, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function FamilyOnboarding({
  onCreateFamily,
}: {
  onCreateFamily: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [familyName, setFamilyName] = useState("");
  const [inviteEmails, setInviteEmails] = useState([""]);
  const [isCreating, setIsCreating] = useState(false);
  const createFamily = useMutation(api.families.createFamily);

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const removeEmailField = (index: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyName.trim()) {
      toast.error("Family name is required");
      return;
    }

    // Validate emails
    const validEmails = inviteEmails.filter((email) => email.trim());
    for (const email of validEmails) {
      if (!validateEmail(email)) {
        toast.error(`Invalid email: ${email}`);
        return;
      }
    }

    setIsCreating(true);
    try {
      await createFamily({
        name: familyName.trim(),
        inviteEmails: validEmails,
      });
      toast.success("Family created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create family"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-background to-muted/20">
      <div className="">
        <Button
          onClick={() => onCreateFamily(false)}
          variant="ghost"
          size="icon"
          className="rounded-2xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center"
              >
                <Users className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Create Family
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Set up your family expense tracking group
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="family-name" className="text-sm font-medium">
                  Family Name
                </Label>
                <Input
                  id="family-name"
                  placeholder="The Smith Family"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="h-12 rounded-2xl bg-background/50"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Invite Family Members
                  </Label>
                  <Button
                    onClick={addEmailField}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <AnimatePresence>
                  {inviteEmails.map((email, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder="family@example.com"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        className="h-12 rounded-2xl bg-background/50"
                        type="email"
                      />
                      {inviteEmails.length > 1 && (
                        <Button
                          onClick={() => removeEmailField(index)}
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-2xl shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isCreating}
                className="w-full h-12 text-base font-medium rounded-2xl"
                size="lg"
              >
                Create Family
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
