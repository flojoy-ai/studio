import React from "react";

type ResolveBlockSVG = (
  svgMap: { default: React.JSX.Element } & Record<string, React.JSX.Element>,
) => React.FC<{ blockName: string }>;

export const resolveBlockSVG: ResolveBlockSVG = (svgMap) => {
  const SVGComponent = ({ blockName }: { blockName: string }) => {
    return blockName in svgMap ? svgMap[blockName] : svgMap["default"];
  };
  SVGComponent.displayName = "BlockSVG";
  return SVGComponent;
};
