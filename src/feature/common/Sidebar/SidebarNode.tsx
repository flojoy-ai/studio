import { createStyles, Divider, useMantineTheme } from "@mantine/core";
import {
  CMND_MANIFEST,
  NodeElement,
  Manifest_Child,
} from "@src/utils/ManifestLoader";
import SidebarSection from "./SidebarSection";
import { AppTab, LeafClickHandler } from "@feature/common/Sidebar/Sidebar";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { ControlElement } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

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
    padding: theme.spacing.xs,
    cursor: "pointer",
    margin: "5px",
    fontFamily: "monospace",
    transition: "100ms ease-in",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[1] + "6f"
          : theme.colors.accent2[1] + "4f",
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  divider: {
    "& .mantine-Divider-label": {
      marginTop: 0,
    },
  },
}));

type SidebarNodeProps = {
  depth: number;
  node:
    | CMND_MANIFEST<NodeElement | ControlElement>
    | Manifest_Child<NodeElement | ControlElement>;
  leafClickHandler: LeafClickHandler;
  query: string;
  matchedParent: boolean;
  expand: boolean;
  collapse: boolean;
  appTab: AppTab;
};

const nodeTitleMatches = (
  query: string,
  node: Manifest_Child<NodeElement | ControlElement>
) =>
  Boolean(
    query !== "" &&
      node.name?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  );

const SidebarNode = ({
  depth,
  node,
  leafClickHandler,
  query,
  matchedParent = false,
  expand,
  collapse,
  appTab,
}: SidebarNodeProps) => {
  const { classes } = useSidebarStyles();
  const theme = useMantineTheme();

  if (node.name === "ROOT") {
    if (!node.children) return null;
    return (
      <div>
        {node.children.map((c) => {
          // Actually needs to be called as a function to achieve depth-first traversal,
          // otherwise React lazily evaluates it and doesn't recurse immediately, resulting in breadth-first traversal.
          return SidebarNode({
            node: c,
            depth: 0,
            leafClickHandler,
            query,
            matchedParent: nodeTitleMatches(query, c),
            expand,
            collapse,
            appTab,
          });
        })}
      </div>
    );
  }
  const hasNode = node.children?.every((n) => !n.children);

  if (!hasNode) {
    return (
      <SidebarSection
        title={node.name ?? ""}
        depth={depth + 1}
        expand={expand}
        collapse={collapse}
        key={node.name}
      >
        {(node.children as Manifest_Child<NodeElement | ControlElement>[])?.map(
          (c) =>
            SidebarNode({
              node: c,
              depth: depth + 1,
              leafClickHandler,
              query,
              matchedParent: matchedParent || nodeTitleMatches(query, c),
              expand,
              collapse,
              appTab,
            })
        )}
      </SidebarSection>
    );
  }

  const commands = node.children?.filter((c) => !c.children) ?? [];
  const lowercased = query.toLocaleLowerCase();
  const shouldFilter = query !== "" && !matchedParent;
  const searchMatches = shouldFilter
    ? commands?.filter(
        (c) =>
          c.key?.toLocaleLowerCase().includes(lowercased) ||
          c.name?.toLocaleLowerCase().includes(lowercased)
      )
    : commands;

  if (searchMatches?.length === 0) {
    return null;
  }
  return (
    <div key={node.name}>
      <Divider
        variant="dashed"
        color={
          theme.colorScheme === "dark"
            ? theme.colors.accent1[0]
            : theme.colors.accent2[0]
        }
        label={node.name}
        w="80%"
        className={classes.divider}
      />
      {searchMatches?.map((command) => (
        <button
          key={command.key}
          className={classes.buttonLeafNode}
          onClick={() => {
            if (query !== "" && appTab === "FlowChart") {
              sendEventToMix("Node Searched", command.name ?? "", "nodeTitle");
            }
            leafClickHandler(command as NodeElement | ControlElement);
          }}
        >
          {command.key ?? command.name}
        </button>
      ))}
    </div>
  );
};

export default SidebarNode;
