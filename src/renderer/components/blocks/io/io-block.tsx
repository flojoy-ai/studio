import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import { DodecahedronSVG } from "@/renderer/assets/DodecahedronSVG";
import DefaultBlock from "../default-block";

const IOBlock = (props: CustomNodeProps) => {
  console.log("props.type: ", props.type, props.data.type);
  return (
    <DefaultBlock {...props} className="!border-none !p-0" variant="accent4">
      <DodecahedronSVG />
    </DefaultBlock>
  );
};

export default memo(IOBlock);
