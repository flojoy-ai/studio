import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useNodesInitialized, useReactFlow } from "reactflow";
import { YoutubeIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GalleryApp } from "@src/types/gallery";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  Project,
  projectAtom,
  projectPathAtom,
} from "@src/hooks/useFlowChartState";
import { unsavedChangesAtom } from "@src/hooks/useHasUnsavedChanges";
import { useSocket } from "@src/hooks/useSocket";

export interface AppGalleryElementProps {
  galleryApp: GalleryApp;
  setIsGalleryOpen: (isOpen: boolean) => void;
}

export const GalleryElement = ({
  galleryApp,
  setIsGalleryOpen,
}: AppGalleryElementProps) => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const setProject = useSetAtom(projectAtom);
  const setHasUnsavedChanges = useSetAtom(unsavedChangesAtom);
  const setProjectPath = useSetAtom(projectPathAtom);

  const { ctrlsManifest, setCtrlsManifest } = useControlsState();

  const rfInstance = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const { states } = useSocket();
  const { setProgramResults } = states;

  const handleAppLoad = async () => {
    const raw = await import(`../../data/apps/${galleryApp.appPath}.json`);
    const app = raw as Project;
    if (!app.rfInstance) {
      throw new Error("Gallery app is missing flow chart data");
    }

    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    setProject({
      name: galleryApp.title,
      rfInstance: app.rfInstance,
    });
    loadFlowExportObject(app.rfInstance, app.textNodes ?? []);
    setProjectPath(undefined);
    setIsGalleryOpen(false);
    setHasUnsavedChanges(false);
    setProgramResults([]);
  };

  useEffect(() => {
    // fixes the issue that app is not centered in the viewport
    if (nodesInitialized) {
      rfInstance.fitView({
        padding: 0.8,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesInitialized]);

  return (
    <div className="min-h-40 m-1">
      <div className="flex w-full">
        <Avatar className="m-1 h-36 w-36">
          <AvatarImage className="object-contain" src={galleryApp.imagePath} />
        </Avatar>
        <div className="px-2" />

        <div className="flex grow flex-col items-start">
          <div className="text-xl font-semibold">{galleryApp.title}</div>
          <div className="text-sm font-thin">{galleryApp.description}</div>

          <div className="py-1" />

          <div>
            {galleryApp.relevantNodes.map((node) => (
              <a
                href={node.docs}
                key={node.name}
                target="_blank"
                className="rounded-md bg-muted p-1 text-sm"
              >
                {node.name}
              </a>
            ))}
          </div>

          <div className="py-1" />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              data-testid="gallery-load-button"
              onClick={async () => {
                await handleAppLoad();
              }}
            >
              Load
            </Button>

            {galleryApp.youtubeLink && (
              <a href={galleryApp.youtubeLink} target="_blank">
                <Button variant="outline" size="sm" className="">
                  <YoutubeIcon />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
