import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { GoogleLogo } from "./components/GoogleLogo";
import { Button } from "./components/ui/button";

export function SignInForm() {
  const { signIn } = useAuthActions();

  const handleSignIn = async () => {
    // Check if there's an invitation token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const invitationToken = urlParams.get("invite-token");

    // Store the invitation token in localStorage if it exists
    // This preserves the token through the OAuth redirect flow
    if (invitationToken) {
      localStorage.setItem("pendingInvitationToken", invitationToken);
    }

    // Proceed with sign in
    await signIn("google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xs">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center"
            >
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">
                FamilyTracker
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Track expenses together, plan better
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              className="w-full h-12 text-base font-medium rounded-2xl"
              variant="outline"
              type="button"
              onClick={() => void handleSignIn()}
            >
              <GoogleLogo className="mr-2 h-4 w-4" /> Continue with Google
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
