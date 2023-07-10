import { createStyles, Image, Flex, UnstyledButton } from "@mantine/core";
import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { IconBrandYoutube } from "@tabler/icons-react";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";

export interface AppGalleryElementProps {
  linkText: string;
  link: string;
  elementTitle: string;
  imagePath: string;
  youtubeLink?: string;
  appPath?: string;
}

export const AppGalleryElementStyles = createStyles((theme) => ({
  elementTitle: {
    display: "flex",
    marginBottom: 0,
    marginLeft: 3,
    width: "8.3vw",
  },
  link: {
    textDecoration: "none",
    width: "8.5vw",
    marginLeft: 3,
  },
  elementLayout: {
    mih: 50,
    width: "8.5vw",
    flexWrap: "wrap",
    textAlign: "left",
  },
  icon: {
    marginLeft: "auto",
  },
}));
export const AppGalleryElement = ({
  linkText,
  link,
  elementTitle,
  imagePath,
  youtubeLink = "https://www.youtube.com",
  appPath = "flojoy",
}: AppGalleryElementProps) => {
  const { classes } = AppGalleryElementStyles();
  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();
  const { setIsGalleryOpen } = useFlowChartState();

  const open = async () => {
    const raw = await import(`../../../utils/app-gallery-apps/${appPath}.json`);
    const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    loadFlowExportObject(flow);
    setIsGalleryOpen(false);
  };

  return (
    <UnstyledButton onClick={open}>
      <Flex className={classes.elementLayout}>
        <Image height={120} width={"8.5vw"} fit="contain" src={imagePath} />
        <h4 className={classes.elementTitle}>
          {elementTitle}
          <div className={classes.icon}>
            <UnstyledButton component="a" target="_blank" href={youtubeLink}>
              <IconBrandYoutube />
            </UnstyledButton>
          </div>
        </h4>
        <a href={link} className={classes.link}>
          {linkText}
        </a>
      </Flex>
    </UnstyledButton>
  );
};
