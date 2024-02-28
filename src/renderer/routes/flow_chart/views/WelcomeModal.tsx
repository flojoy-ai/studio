import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";
import HeaderTab from "@/renderer/routes/common/HeaderTab";
import { useLoadApp } from "@/renderer/hooks/useLoadApp";
import { Button } from "@/renderer/components/ui/button";
import { showWelcomeScreenAtom } from "@/renderer/hooks/useFlowChartState";
import { useAtom, useSetAtom } from "jotai";
import { GalleryModal } from "@/renderer/components/gallery/GalleryModal";
import packageJson from "../../../../../package.json";
import { useFullManifest } from "@/renderer/hooks/useManifest";
import { useEffect, useState } from "react";
import { useActiveTab, tabAtom, TabName } from "@/renderer/hooks/useActiveTab";
import { useWindowSize } from "react-use";
import {
  MixPanelEvents,
  sendEventToMix,
} from "@/renderer/services/MixpanelServices";

export function WelcomeModal() {
  const openFileSelector = useLoadApp();
  const manifest = useFullManifest();
  const [showGallery, setShowGallery] = useState(false);
  const { activeTab, setActiveTab } = useActiveTab();
  interface Tab {
    to: string;
    fullText: TabName;
    shortText: string;
    testId: string;
  }
  
  const tabs: Tab[] = [
    {
      to: "/test-sequencer",
      fullText: "Test Sequencer",
      shortText: "Sequencer",
      testId: "test-sequencer-btn",
    },
  ];
  const lg = 1024;
  const { width } = useWindowSize();
  const large = width > lg;
  // const [activeTab, setActiveTab] = useAtom(tabAtom);
  // console.log(useActiveTab);
  // console.log(tabAtom);
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
  const handleOpenTab = () => {
    setShowWelcomeScreen(false);
    // console.log(activeTab);
    setActiveTab("Test Sequencer");
    // console.log(activeTab);
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
            <Button onClick={handleOpenGallery}>Open App Gallery</Button>
            <Button onClick={() => setActiveTab("Test Sequencer")}>Open Test Sequencer</Button>
            {tabs.map((t) => (
              <HeaderTab
                to={t.to}
                testId={t.testId}
                key={t.fullText}
                tabName={t.fullText}
              >
                {large ? t.fullText : t.shortText}
              </HeaderTab>
            ))}
            {/* handleOpenTab */}
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showGallery && <GalleryModal
              isGalleryOpen={showGallery}
              setIsGalleryOpen={setShowGallery}
      />}
    </>
  );
};
