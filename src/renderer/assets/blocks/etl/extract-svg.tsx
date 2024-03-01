import { memo } from "react";
import { resolveBlockSVG } from "../svg-helper";

const DefaultExtractBlock = (
  <svg
    width="100pt"
    height="100pt"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m80.359 14.641h-60.719c-2.7617 0-5 2.2383-5 5v60.719c0 1.3281 0.52734 2.5977 1.4648 3.5352s2.207 1.4648 3.5352 1.4648h55.719l10-10v-55.719c0-1.3281-0.52734-2.5977-1.4648-3.5352s-2.207-1.4648-3.5352-1.4648zm-17.859 65.359h-21.34v-10.762h-8.082v10.762h-8.0781v-12.512c0-2.7578 2.2383-5 5-5h27.5c1.3242 0 2.5977 0.52734 3.5352 1.4648s1.4648 2.2109 1.4648 3.5352zm12.5-28.75c0 1.3242-0.52734 2.5977-1.4648 3.5352s-2.2109 1.4648-3.5352 1.4648h-40c-2.7617 0-5-2.2383-5-5v-31.609h50z"
      className="fill-accent2"
    />
  </svg>
);

const blockNameToSVGMap = {
  default: DefaultExtractBlock,
};
const ExtractBlockSvg = resolveBlockSVG(blockNameToSVGMap);

export default memo(ExtractBlockSvg);
