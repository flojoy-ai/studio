import { memo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import DefaultBlock from "./default-block";
import ScipySvg from "@/renderer/assets/blocks/scipy-svg";

export type ScipyCategory = "SCIPY";

const ScipyBlock = (props: CustomNodeProps) => {
  return (
    <DefaultBlock {...props} showLabel={false}>
      <div className="flex flex-col items-center justify-center gap-2 p-3">
        <ScipySvg height={"100pt"} width={"100pt"} />
        <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
          <span>sp.</span>
          <span className="font-extrabold">{props.data.label}</span>
        </h2>
      </div>
    </DefaultBlock>
  );
};

export default memo(ScipyBlock);
