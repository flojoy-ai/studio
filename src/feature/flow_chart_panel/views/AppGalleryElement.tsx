import { Image, Flex, UnstyledButton } from "@mantine/core";
import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { IconBrandYoutube } from "@tabler/icons-react";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";

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
      <Flex className="w-9/12 flex-wrap text-left">
        <Image height={"15vh"} width={"12vw"} fit="fill" src={imagePath} />
        <div className="mt-2 flex w-full">
          <h4 className="mt-1 w-full">{elementTitle}</h4>
          <UnstyledButton component="a" target="_blank" href={youtubeLink}>
            <IconBrandYoutube />
          </UnstyledButton>
        </div>
        <a href={link} className="mt-1 w-full text-sky-500 no-underline">
          {linkText}
        </a>
      </Flex>
    </UnstyledButton>
  );
};
