import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import {
  ReactFlowJsonObject,
  useNodesInitialized,
  useReactFlow,
} from "reactflow";
import { ElementsData } from "@/types";
import { YoutubeIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GalleryApp } from "@src/types/gallery";
import { useEffect } from "react";

export interface AppGalleryElementProps {
  galleryApp: GalleryApp;
  setIsGalleryOpen: (isOpen: boolean) => void;
}

export const GalleryElement = ({
  galleryApp,
  setIsGalleryOpen,
}: AppGalleryElementProps) => {
  const { loadFlowExportObject } = useFlowChartGraph();

  const { ctrlsManifest, setCtrlsManifest } = useControlsState();

  const rfInstance = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  const handleAppLoad = async () => {
    const raw = await import(`../../data/apps/${galleryApp.appPath}.json`);
    const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, unknown>;
    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    loadFlowExportObject(flow);
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    // fixes the issue that app is not centered in the viewport
    if (nodesInitialized) {
      rfInstance.fitView();
    }
  }, [nodesInitialized]);

  return (
    <div data-testid="gallery-element-btn" className="min-h-40 m-1">
      <div className="flex w-full">
        <Avatar className="m-1 h-36 w-36">
          <AvatarImage src={galleryApp.imagePath} />
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
