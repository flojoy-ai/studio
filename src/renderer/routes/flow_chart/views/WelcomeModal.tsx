import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";
import { useLoadApp } from "@src/hooks/useLoadApp";
import { Button } from "@/renderer/components/ui/button";
import { showWelcomeScreenAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";

import packageJson from "../../../../../package.json";
import { useFullManifest } from "@src/hooks/useManifest";
import { useEffect } from "react";
import { MixPanelEvents, sendEventToMix } from "@src/services/MixpanelServices";

export function WelcomeModal() {
  const openFileSelector = useLoadApp();
  const manifest = useFullManifest();
  const [showWelcomeScreen, setShowWelcomeScreen] = useAtom(
    showWelcomeScreenAtom,
  );
  useEffect(() => {
    window.api.getSetupExecutionTime().then((t) => {
      sendEventToMix(MixPanelEvents.flojoyLoaded, {
        timeTaken: `${t} seconds`,
      });
    });
  }, []);

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
            disabled={!manifest}
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
