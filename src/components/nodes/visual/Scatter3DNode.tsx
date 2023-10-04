import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import { Vec3 } from "regl";
import Scatter3D from "@src/assets/nodes/3DScatter";
import { OrderedTripleData } from "@src/feature/common/types/ResultsType";
import { ScatterPlot3D } from "@src/lib/plot/plots/3d/scatter";

// It's very slow having to convert this from the ordered triple format to vertex format...
// For best performance we may need to rework how ordered triple data is stored.
const zip = (data: { x: number[]; y: number[]; z: number[] }) => {
  const orderedTriple: Vec3[] = [];
  for (let i = 0; i < data.x.length; i++) {
    orderedTriple.push([data.x[i], data.y[i], data.z[i]]);
  }
  return orderedTriple;
};

const Scatter3DNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeError, nodeResult } = useNodeStatus(data.id);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const scatter = useRef<ScatterPlot3D | null>(null);

  useEffect(() => {
    if (scatter.current && nodeResult?.result?.data) {
      const pts = zip(nodeResult.result.data as OrderedTripleData);

      scatter.current.updateData(pts);
    }
  }, [nodeResult?.result.data]);

  useEffect(() => {
    if (!scatter.current && canvas.current && nodeResult?.result?.data) {
      const pts = zip(nodeResult.result.data as OrderedTripleData);
      scatter.current = new ScatterPlot3D(canvas.current, pts, {
        axes: {
          x: {
            domain: [0, 10],
            step: 1,
          },
          y: {
            domain: [0, 10],
            step: 1,
          },
          z: {
            domain: [0, 10],
            step: 1,
          },
        },
        cameraOptions: {
          center: [2.5, 2.5, 2.5],
        },
        color: [0.6, 0.96, 1, 1],
        backgroundColor: [0.1, 0.1, 0.1, 1],
      });
      scatter.current.frame();
    }
  }, [nodeResult?.result.data]);

  if (!nodeResult?.result?.data) {
    return (
      <NodeWrapper nodeError={nodeError}>
        <div
          className={clsx(
            "rounded-2xl bg-transparent",
            { "shadow-around shadow-accent2": selected },
            { "shadow-around shadow-red-700": nodeError },
          )}
        >
          <Scatter3D />
          <HandleComponent data={data} variant="accent2" />
        </div>
      </NodeWrapper>
    );
  }

  return (
    <NodeWrapper nodeError={nodeError}>
      <div
        className={clsx(
          "rounded-2xl bg-transparent p-8",
          { "shadow-around shadow-accent2": selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <canvas
          ref={canvas}
          id={`canvas-${id}`}
          className="nodrag"
          width={360}
          height={224}
        />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(Scatter3DNode);
