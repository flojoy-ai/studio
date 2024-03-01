export const resolveBlockSVG = (
  svgMap: { default: React.JSX.Element } & Record<string, React.JSX.Element>,
) => {
  const SVGComponent = ({ blockName }: { blockName: string }) => {
    return blockName in svgMap ? svgMap[blockName] : svgMap["default"];
  };
  SVGComponent.displayName = "BlockSVG";
  return SVGComponent;
};
