import { memo } from "react";
import { type CustomNodeProps } from "./types/nodeProps";
import NodeWrapper from "./components/NodeWrapper";
import HandleComponent from "./components/HandleComponent";
import { textWrap } from "@/utils/textWrap";

const DefaultNode = ({
  data,
  width,
  height,
  children,
}: CustomNodeProps & {
  width?: number;
  height?: number;
  children?: React.ReactNode;
}) => {
  return (
    <NodeWrapper>
      <div
        className="relative flex min-h-[160px] items-center justify-center break-words rounded-2xl border-2 border-solid border-accent1 bg-accent1/5 p-2"
        style={{
          width: width ?? textWrap(160, 24, data.label),
          minHeight: height,
        }}
      >
        {children ?? (
          <h2 className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent1">
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} variant="accent1" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DefaultNode);
