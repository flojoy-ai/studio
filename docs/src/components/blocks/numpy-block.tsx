import { memo } from "react";
import { type BlockProps } from "./types/block";
import DefaultBlock from "./default-block";
import NumpySvg from "@/assets/blocks/APPEND.svg?react";

export type NumpyCategory = "NUMPY";

const NumpyBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} showLabel={false} variant="accent2">
      <div className="flex flex-col items-center justify-center gap-2 p-3">
        <NumpySvg />
        <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
          <span>np.</span>
          <span className="font-extrabold">{props.data.label}</span>
        </h2>
      </div>
    </DefaultBlock>
  );
};

export default memo(NumpyBlock);
