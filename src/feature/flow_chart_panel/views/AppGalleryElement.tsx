// import { Image, Flex, UnstyledButton } from "@mantine/core";
import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";
import { YoutubeIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <>
      <div className="relative w-full">
        <Button onClick={onClick} className="relative mr-auto hover:bg-white dark:hover:bg-black h-2/3" variant="ghost">
          <div className="h-full w-full text-left">
            {/* <img height={"15vh"} width={"15.2vw"} src={imagePath} /> */}
            <Avatar className="h-10/12 w-40">
              <AvatarImage src={imagePath} />
            </Avatar>
            <div className="mt-2 flex w-full">
              <h4 className="mt-1 w-full">{elementTitle}</h4>
              <Button variant="ghost" size="icon" className="mt-1.5 h-4">
                <YoutubeIcon target="_blank" href={youtubeLink} />
              </Button>
            </div>
          </div>
        </Button>
        <div className="mt-2 p-2">
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
