export const resolveBlockSVG = (svgMap: Record<string, React.JSX.Element>) => {
  const SVGComponent = ({ blockName }: { blockName: string }) => {
    return blockName in svgMap ? svgMap[blockName] : svgMap["default"];
  };
  SVGComponent.displayName = "BlockSVG";
  return SVGComponent;
};
