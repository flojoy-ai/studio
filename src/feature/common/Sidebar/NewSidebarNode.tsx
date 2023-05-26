import { Box, Group, UnstyledButton, createStyles } from "@mantine/core";
import {
  CommandManifestMap,
  CommandSection,
} from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import NewSidebarSection from "./NewSidebarSection";
import { Controls } from "reactflow";

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
};

const NewSidebarNode = ({
  depth,
  manifestMap,
  node,
  leafClickHandler,
  query,
}: SidebarNodeProps) => {
  const { classes } = useSidebarStyles();
  console.log(node.title);

  if (node.title === "ROOT") {
    if (!node.children) return null;

    return (
      <div>
        {node.children.map((c) => (
          <NewSidebarNode
            node={c}
            depth={0}
            manifestMap={manifestMap}
            key={c.title}
            leafClickHandler={leafClickHandler}
            query={query}
          />
        ))}
      </div>
    );
  }

  if (node.children) {
    // console.log(
    //   node.title,
    //   node.children.map((c) => (
    //     <NewSidebarNode
    //       node={c}
    //       depth={depth + 1}
    //       manifestMap={manifestMap}
    //       key={c.title}
    //       leafClickHandler={leafClickHandler}
    //       query={query}
    //     />
    //   ))
    // );
    console.log("Checking children for ", node.title);
    const content = node.children.map((c) => (
      <NewSidebarNode
        node={c}
        depth={depth + 1}
        manifestMap={manifestMap}
        key={c.title}
        leafClickHandler={leafClickHandler}
        query={query}
      />
    ));
    console.log("Children are:", content);
    if (content.every((x) => x === null)) {
      console.log("all null");
      return null;
    }
    return (
      <NewSidebarSection title={node.title} depth={depth + 1}>
        {content}
      </NewSidebarSection>
    );
  }

  const key = node.key ?? "";

  const commands = manifestMap[key] ?? [];
  const lowercased = query.toLocaleLowerCase();
  const searchMatches =
    query !== ""
      ? commands.filter(
          (c) =>
            c.key.toLocaleLowerCase() === lowercased ||
            c.name.toLocaleLowerCase() === lowercased
        )
      : commands;
  if (searchMatches.length === 0) {
    console.log("nothing");
    return null;
  }
  console.log("something");

  return (
    <NewSidebarSection title={node.title} depth={depth}>
      {searchMatches.map((command) => (
        <button
          key={command.key}
          className={classes.buttonLeafNode}
          onClick={() => leafClickHandler(command.key ?? key)}
        >
          {command.key || command.name}
        </button>
      ))}
    </NewSidebarSection>
  );
};

export default NewSidebarNode;
