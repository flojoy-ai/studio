import { useTheme } from "@/renderer/providers/themeProvider";

const withThemeSVG = (
  svgMap: Record<string, (theme?: "dark" | "light") => React.JSX.Element>,
) => {
  const SVGComponent = ({ blockName }: { blockName: string }) => {
    const { resolvedTheme } = useTheme();
    return blockName in svgMap
      ? svgMap[blockName](resolvedTheme)
      : svgMap["default"](resolvedTheme);
  };
  SVGComponent.displayName = "BlockSVG";
  return SVGComponent;
};

export default withThemeSVG;
