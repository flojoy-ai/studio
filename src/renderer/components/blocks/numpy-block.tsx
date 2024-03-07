import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DefaultBlock from "./default-block";
import NumpySvg from "@/renderer/assets/blocks/numpy/default.svg?react";

export type NumpyCategory = "NUMPY";

const NumpyBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} showLabel={false} variant="accent2">
      <div className="flex flex-col items-center justify-center gap-2 p-3">
        <NumpySvg height={"100pt"} width={"100pt"} />
        <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
          <span>np.</span>
          <span className="font-extrabold">{props.data.label}</span>
        </h2>
      </div>
    </DefaultBlock>
  );
};

export default memo(NumpyBlock);
