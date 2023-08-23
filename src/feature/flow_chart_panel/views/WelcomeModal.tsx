import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLoadApp } from "@src/hooks/useLoadApp";
import { Button } from "@/components/ui/button";
import { showWelcomeScreenAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";

export function WelcomeModal() {
  const openFileSelector = useLoadApp();
  const [showWelcomeScreen, setShowWelcomeScreen] = useAtom(
    showWelcomeScreenAtom,
  );

  return (
    <AlertDialog open={showWelcomeScreen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Flojoy Studio!</AlertDialogTitle>
          <AlertDialogDescription>
            Introducing our Alpha Release: Expect exciting improvements and
            possible breaking changes as we refine and enhance the app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowWelcomeScreen(false);
            }}
          >
            Try out Flojoy Studio
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              openFileSelector();
            }}
          >
            Load Project
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
