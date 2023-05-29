import { createStyles, Divider, useMantineTheme } from "@mantine/core";
import {
  CommandManifestMap,
  CommandSection,
} from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import SidebarSection from "./SidebarSection";

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
  depth: number;
  manifestMap: CommandManifestMap;
  node: CommandSection;
  leafClickHandler: (key: string) => void;
  query: string;
  matchedParent: boolean;
};

const nodeTitleMatches = (query: string, node: CommandSection) =>
  query !== "" &&
  node.title.toLocaleLowerCase().includes(query.toLocaleLowerCase());

const SidebarNode = ({
  depth,
  manifestMap,
  node,
  leafClickHandler,
  query,
  matchedParent = false,
}: SidebarNodeProps) => {
  const { classes } = useSidebarStyles();
  const theme = useMantineTheme();

  if (node.title === "ROOT") {
    if (!node.children) return null;

    return (
      <div>
        {node.children.map((c) => {
          // Actually needs to be called as a function to achieve depth-first traversal,
          // otherwise React lazily evaluates it and doesn't recurse immediately, resulting in breadth-first traversal.
          return SidebarNode({
            node: c,
            depth: 0,
            manifestMap,
            leafClickHandler,
            query,
            matchedParent: nodeTitleMatches(query, c),
          });
        })}
      </div>
    );
  }

  if (node.children) {
    return (
      <SidebarSection title={node.title} depth={depth + 1}>
        {node.children.map((c) =>
          SidebarNode({
            node: c,
            depth: depth + 1,
            manifestMap,
            leafClickHandler,
            query,
            matchedParent: matchedParent || nodeTitleMatches(query, c),
          })
        )}
      </SidebarSection>
    );
  }

  const key = node.key ?? "";

  const commands = manifestMap[key] ?? [];
  const lowercased = query.toLocaleLowerCase();
  const shouldFilter = query !== "" && !matchedParent;
  const searchMatches = shouldFilter
    ? commands.filter(
        (c) =>
          c.key.toLocaleLowerCase().includes(lowercased) ||
          c.name.toLocaleLowerCase().includes(lowercased)
      )
    : commands;

  if (searchMatches.length === 0) {
    return null;
  }

  return (
    <div>
      <Divider
        variant="dashed"
        color={
          theme.colorScheme === "dark"
            ? theme.colors.accent1[0]
            : theme.colors.accent2[0]
        }
        label={node.title}
        w="80%"
      />
      {searchMatches.map((command) => (
        <button
          key={command.key}
          className={classes.buttonLeafNode}
          onClick={() => leafClickHandler(command.key ?? key)}
        >
          {command.key || command.name}
        </button>
      ))}
    </div>
  );
};

export default SidebarNode;
