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

import packageJson from "../../../../package.json";

export function WelcomeModal() {
  const openFileSelector = useLoadApp();
  const [showWelcomeScreen, setShowWelcomeScreen] = useAtom(
    showWelcomeScreenAtom,
  );

  return (
    <AlertDialog open={showWelcomeScreen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Welcome to Flojoy Studio V{packageJson.version}
          </AlertDialogTitle>
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
            id="close-welcome-modal"
            data-testid="close-welcome-modal"
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
