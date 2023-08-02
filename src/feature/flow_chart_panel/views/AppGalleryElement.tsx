import { Image, Flex, UnstyledButton } from "@mantine/core";
import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";
import { YoutubeIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";

export interface AppGalleryElementProps {
  linkText: string;
  link: string;
  elementTitle: string;
  imagePath: string;
  youtubeLink?: string;
  appPath?: string;
}
export const AppGalleryElement = ({
  linkText,
  link,
  elementTitle,
  imagePath,
  youtubeLink = "https://www.youtube.com",
  appPath = "flojoy",
}: AppGalleryElementProps) => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();
  const { setIsGalleryOpen } = useFlowChartState();

  const onClick = async () => {
    const raw = await import(`../../../utils/app-gallery-apps/${appPath}.json`);
    const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    loadFlowExportObject(flow);
    setIsGalleryOpen(false);
  };

  return (
    <UnstyledButton onClick={onClick} className="mr-auto">
      <div className="w-9/12 flex-wrap text-left">
        <img className="h-[15vh] w-[12vw] object-fill" src={imagePath} />
        <div className="mt-2 flex w-full">
          <h4 className="mt-1 w-full">{elementTitle}</h4>
          <Button variant="ghost" size="icon" className="mt-1.5 h-4">
            <YoutubeIcon target="_blank" href={youtubeLink} />
          </Button>
        </div>
        <a
          href={link}
          target="_blank"
          className="mt-1 w-full text-sky-500 no-underline"
        >
          {linkText}
        </a>
      </div>
    </UnstyledButton>
  );
};
