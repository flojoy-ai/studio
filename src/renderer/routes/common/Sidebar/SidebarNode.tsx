import {
  Leaf,
  RootNode,
  RootChild as SectionChild,
  ParentNode,
} from "@/renderer/types/manifest";
import { isLeaf, isRoot, isLeafParentNode } from "@/renderer/utils/manifest";
import SidebarSection from "@/renderer/routes/common/Sidebar/SidebarSection";
import { LeafClickHandler } from "@/renderer/routes/common/Sidebar/Sidebar";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import NumpySvg from "@/renderer/assets/blocks/numpy/default.svg?react";
import ScipySvg from "@/renderer/assets/blocks/scipy/default.svg?react";
import DefaultAISvg from "@/renderer/assets/blocks/ai-ml/default.svg?react";
import DefaultDataSvg from "@/renderer/assets/blocks/data/default.svg?react";
import DefaultDSPSvg from "@/renderer/assets/blocks/dsp/default.svg?react";
import DefaultDebuggingSvg from "@/renderer/assets/blocks/debugging/default.svg?react";
import DefaultEtlSvg from "@/renderer/assets/blocks/etl/default.svg?react";
import DefaultVisorSVG from "@/renderer/assets/blocks/visualization/default.svg?react";
import { matchesQuery } from "@/renderer/utils/search";
import DefaultHardwareSvg from "@/renderer/assets/blocks/hardware/default.svg?react";

export const sidebarVariants = cva(undefined, {
  variants: {
    variant: {
      AI_ML: "text-accent6 bg-accent6/5 border-accent6",
      DEBUGGING: "text-accent5 bg-accent5/5 border-accent5",
      VISUALIZATION: "text-accent5 bg-accent5/5 border-accent5",
      DATA: "text-accent2 bg-accent2/5 border-accent2",
      ETL: "text-accent1 bg-accent1/5 border-accent1",
      IO: "text-accent4 bg-accent4/5 border-accent4",
      LOGIC: "text-accent3 bg-accent3/5 border-accent3",
      AUTOGEN: "text-blue-500 bg-blue-500/5 border-blue-500",
    },
  },
});

export const categoryMap = {
  AI_ML: "AI_ML",
  DATA: "DATA",
  VISUALIZATION: "VISUALIZATION",
  DSP: "DATA",
  ETL: "ETL",
  MATH: "ETL",
  HARDWARE: "IO",
  CONTROL_FLOW: "LOGIC",
  NUMPY: "AUTOGEN",
  SCIPY: "AUTOGEN",
  SKLEARN: "AUTOGEN",
  DEBUGGING: "DEBUGGING",
};

const autogeneratedCategories = ["NUMPY", "SCIPY", "SKLEARN"];

type IconMap = { [key in keyof typeof categoryMap]: ReactNode | undefined };
const iconMap: IconMap = {
  AI_ML: <DefaultAISvg className="h-8 w-8" />,
  DATA: <DefaultDataSvg className="h-9 w-9" />,
  DSP: <DefaultDSPSvg className="h-8 w-8" />,
  ETL: <DefaultEtlSvg className="h-8 w-8" />,
  HARDWARE: <DefaultHardwareSvg className="h-8 w-8" />,
  NUMPY: <NumpySvg className="h-8 w-8" />,
  SCIPY: <ScipySvg className="h-8 w-8" />,
  DEBUGGING: <DefaultDebuggingSvg className="h-8 w-8" />,
  CONTROL_FLOW: undefined,
  MATH: undefined,
  VISUALIZATION: <DefaultVisorSVG className="h-8 w-8" />,
  SKLEARN: undefined,
};

type SidebarNodeProps = {
  depth: number;
  node: RootNode | ParentNode | Leaf | SectionChild;
  leafClickHandler: LeafClickHandler;
  query: string;
  matchedParent: boolean;
  expand: boolean;
  collapse: boolean;
  category?: string;
  autogeneratedCategory?: boolean;
  icon?: ReactNode;
};

const SidebarNode = ({
  depth,
  node,
  leafClickHandler,
  query,
  matchedParent = false,
  expand,
  collapse,
  category,
  autogeneratedCategory,
  icon,
}: SidebarNodeProps) => {
  if (isLeaf(node)) {
    return (
      <button
        key={node.key}
        className={twMerge(
          "mb-1.5 flex max-h-10 w-full items-center justify-between rounded-sm border px-2 py-2.5 font-mono",
          sidebarVariants({
            variant: categoryMap[category ?? "TRANSFORMERS"] ?? "ETL",
          }),
        )}
        onClick={() => {
          // if (query !== "") {
          // sendEventToMix("Node Searched", { nodeTitle: node.name ?? "" });
          // }
          leafClickHandler(node);
        }}
      >
        {node.key ?? node.name}
        {icon}
      </button>
    );
  }

  if (isRoot(node)) {
    return (
      <div>
        {node.children.map((c) => {
          // Actually needs to be called as a function to achieve depth-first traversal,
          // otherwise React lazily evaluates it and doesn't recurse immediately, resulting in breadth-first traversal.
          let category: string | undefined;
          let autogeneratedCategory: boolean | undefined;
          let icon: React.ReactNode | undefined;
          if (c.key !== undefined) {
            category = c.key;
            autogeneratedCategory = autogeneratedCategories.includes(c.key);
            icon = iconMap[c.key];
          }
          return SidebarNode({
            node: c,
            depth: 0,
            leafClickHandler,
            query,
            matchedParent: matchesQuery(c.name, query),
            expand,
            collapse,
            category,
            autogeneratedCategory,
            icon,
          });
        })}
      </div>
    );
  }
  if (!isLeafParentNode(node) && node.children) {
    return SidebarSection({
      title: node.name ?? "",
      depth: depth + 1,
      expand: expand,
      collapse: collapse,
      category: category,
      autogeneratedCategory: autogeneratedCategory,
      icon: icon,
      children: node.children?.map((c) => {
        const matched = matchedParent || matchesQuery(c.name, query);

        return SidebarNode({
          node: c,
          depth: depth + 1,
          leafClickHandler,
          query,
          matchedParent: matched,
          expand,
          collapse,
          category,
          autogeneratedCategory,
          icon,
        });
      }),
    });
  }

  const leaves: Leaf[] = (node.children || []).filter((c): c is Leaf =>
    isLeaf(c),
  );

  const shouldFilter = query !== "" && !matchedParent;
  const searchMatches = shouldFilter
    ? leaves?.filter(
        (c) => matchesQuery(c.key, query) || matchesQuery(c.name, query),
      )
    : leaves;

  if (searchMatches?.length === 0 && node.children) {
    return null;
  }

  return (
    <div key={node.name}>
      <SidebarSection
        title={node.name ?? ""}
        depth={depth + 1}
        expand={expand}
        collapse={collapse}
        key={node.name}
        category={category}
        autogeneratedCategory={autogeneratedCategory}
        icon={icon}
      >
        {searchMatches?.map((command) => (
          <button
            key={command.key}
            className={twMerge(
              "mb-1.5 flex max-h-10 w-full items-center justify-between rounded-sm border px-2 py-2.5 font-mono",
              sidebarVariants({
                variant: categoryMap[category ?? "TRANSFORMERS"] ?? "ETL",
              }),
            )}
            onClick={() => {
              // if (query !== "") {
              //   sendEventToMix("Node Searched", {
              //     nodeTitle: command.name ?? "",
              //   });
              // }
              leafClickHandler(command);
            }}
          >
            {command.key ?? command.name}
            {icon}
          </button>
        ))}
      </SidebarSection>
    </div>
  );
};

export default SidebarNode;
