import { motion } from "framer-motion";
import { Mail, Plus, Users } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const NoFamily = ({
  onCreateFamily,
}: {
  onCreateFamily: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //TODO: Implement the request invite functionality
  const onRequestInvite = () => console.log("Request Invite Clicked");
  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mx-auto w-20 h-20 bg-muted rounded-2xl flex items-center justify-center"
            >
              <Users className="w-10 h-10 text-muted-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-xl font-bold">No Family Yet</CardTitle>
              <CardDescription className="text-base mt-2">
                You're not part of a family group. Create one or request an
                invite to get started.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button
              onClick={() => onCreateFamily(true)}
              className="w-full h-12 text-base font-medium rounded-2xl"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-3" />
              Create New Family
            </Button>

            <Button
              onClick={onRequestInvite}
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-2xl bg-background/50"
              size="lg"
            >
              <Mail className="w-5 h-5 mr-3" />
              Request an Invite
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NoFamily;
