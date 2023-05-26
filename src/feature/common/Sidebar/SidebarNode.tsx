import {
  Box,
  ChevronIcon,
  Collapse,
  Group,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { CommandManifestMap } from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import { useState } from "react";

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

  chevron: {
    transition: "transform 200ms ease",
  },
}));

type SidebarNodeProps = {
  onClickHandle: (key: string) => void;
  keyNode: string;
  manifestMap: CommandManifestMap;
  depth: number;
};

const SidebarNode = ({
  onClickHandle,
  keyNode,
  manifestMap,
}: SidebarNodeProps) => {
  const { classes } = useSidebarStyles();
  const commands = manifestMap[keyNode] || [];
  const [open, setOpen] = useState(false);
  return (
    <>
      <Collapse in>
        <div>
          {commands.map((cmd) => (
            <button
              key={cmd.key}
              className={classes.buttonLeafNode}
              onClick={() => {
                onClickHandle(cmd.key || keyNode);
              }}
            >
              {cmd.key || cmd.name}
            </button>
          ))}
        </div>
      </Collapse>
    </>
  );
};

export default SidebarNode;
