import { memo } from "react";
import { type BlockProps } from "./types/block";
import DefaultBlock from "./default-block";
import ScipySvg from "@/assets/blocks/scipy/default.svg?react";

export type ScipyCategory = "SCIPY";

const ScipyBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} showLabel={false}>
      <div className="flex flex-col items-center justify-center gap-2 p-3">
        <ScipySvg />
        <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
          <span>sp.</span>
          <span className="font-extrabold">{props.data.label}</span>
        </h2>
      </div>
    </DefaultBlock>
  );
};

export default memo(ScipyBlock);
