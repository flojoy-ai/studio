import { createStyles } from "@mantine/core";
import { CommandManifestMap } from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import {
  sendEventToMix,
  sendNodeAddedToMix,
} from "@src/services/MixpanelServices";
import { tabType } from "@feature/common/Sidebar/Sidebar";

export const useSidebarStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: theme.spacing.xs,
    color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "10px 20px",
    backgroundColor: theme.colors.accent1[0],
  },

  buttonLeafNode: {
    outline: "0",
    border: `1px solid ${theme.colors.accent4[0]}`,
    backgroundColor: theme.colors.accent4[1],
    color: theme.colors.accent4[0],
    padding: `${theme.spacing.xs}`,
    cursor: "pointer",
    margin: "5px",
    fontFamily: "monospace",
  },
}));

type SidebarNodeProps = {
  onClickHandle: (key: string) => void;
  keyNode: string;
  manifestMap: CommandManifestMap;
  depth: number;
  sideBarType: tabType;
};

const SidebarNode = ({
  onClickHandle,
  keyNode,
  manifestMap,
  sideBarType,
}: SidebarNodeProps) => {
  const { classes } = useSidebarStyles();
  const commands = manifestMap[keyNode] || [];
  if (sideBarType === "flowChart") {
    return (
      <>
        {commands.map((cmd) => (
          <button
            key={cmd.key}
            className={classes.buttonLeafNode}
            onClick={() => {
              sendEventToMix("Node Added", "Node Title", cmd.key || keyNode);
              onClickHandle(cmd.key || keyNode);
            }}
          >
            {cmd.key || cmd.name}
          </button>
        ))}
      </>
    );
  } else {
    return (
      <>
        {commands.map((cmd) => (
          <button
            key={cmd.key}
            className={classes.buttonLeafNode}
            onClick={() => {
              sendEventToMix("Widget Added", "", cmd.key || keyNode);
              onClickHandle(cmd.key || keyNode);
            }}
          >
            {cmd.key || cmd.name}
          </button>
        ))}
      </>
    );
  }
};

export default SidebarNode;
