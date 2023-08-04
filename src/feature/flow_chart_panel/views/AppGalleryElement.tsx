import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";
import { YoutubeIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export interface AppGalleryElementProps {
  linkText: string;
  link: string;
  elementTitle: string;
  imagePath: string;
  youtubeLink?: string;
  appPath?: string;
  setIsGalleryOpen: (open: boolean) => void;
}
export const AppGalleryElement = ({
  linkText,
  link,
  elementTitle,
  imagePath,
  youtubeLink = "https://www.youtube.com",
  appPath = "flojoy",
  setIsGalleryOpen,
}: AppGalleryElementProps) => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();

  const onClick = async () => {
    const raw = await import(`../../../utils/app-gallery-apps/${appPath}.json`);
    const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    loadFlowExportObject(flow);
    setIsGalleryOpen(false);
  };

  return (
    <>
      <div className="relative w-full ">
        <Button
          onClick={onClick}
          className="relative h-2/3 hover:bg-white dark:hover:bg-black"
          variant="ghost"
        >
          <div className="h-11/12 -ml-5 w-11/12 rounded-md border border-white hover:border-black dark:border-black hover:dark:border-white">
            <Avatar className="h-11/12 my-2 ml-2 w-11/12">
              <AvatarImage src={imagePath} />
            </Avatar>
          </div>
        </Button>
        <div className="mb-2 ml-4 flex w-10/12 text-left">
          <h4 className="mt-1 w-full">{elementTitle}</h4>
          <Button variant="ghost" size="icon" className="mt-2 h-4">
            <YoutubeIcon target="_blank" href={youtubeLink} />
          </Button>
        </div>
        <div className="mt-2 p-3">
          <a
            href={link}
            target="_blank"
            className="mt-1 text-sky-500 no-underline"
          >
            {linkText}
          </a>
        </div>
      </div>
    </>
  );
};
