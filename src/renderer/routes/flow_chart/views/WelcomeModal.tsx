import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";
import { Button } from "@/renderer/components/ui/button";
import { useNavigate } from "react-router-dom";
import { showWelcomeScreenAtom } from "@/renderer/hooks/useFlowChartState";
import { useAtom } from "jotai";
import { GalleryModal } from "@/renderer/components/gallery/GalleryModal";
import packageJson from "../../../../../package.json";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import {
  MixPanelEvents,
  sendEventToMix,
} from "@/renderer/services/MixpanelServices";

export function WelcomeModal() {
  const [showGallery, setShowGallery] = useState(false);
  const sequencerLink = "/test-sequencer";
  const navigate = useNavigate();
  const lg = 1024;
  const { width } = useWindowSize();
  const large = width > lg;
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
  const handleOpenGallery = () => {
    setShowWelcomeScreen(false);
    setShowGallery(true);
  };
  const handleOpenSequencer = () => {
    setShowWelcomeScreen(false);
    navigate(sequencerLink);
  };

  return (
    <>
      {showWelcomeScreen && (
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
                onClick={handleOpenGallery}
                id="close-welcome-modal"
                data-testid="close-welcome-modal"
              >
                Open App Gallery
              </Button>
              <Button
                onClick={handleOpenSequencer}
                id="welcome-open-sequencer"
                data-testid="welcome-open-sequencer"
              >
                Open Test Sequencer
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showGallery && (
        <GalleryModal
          isGalleryOpen={showGallery}
          setIsGalleryOpen={setShowGallery}
        />
      )}
    </>
  );
}
