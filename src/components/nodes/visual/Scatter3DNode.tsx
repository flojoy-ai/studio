import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import { Plot, OrthogonalPlane, Points } from "@src/lib/plot";
// import Scatter3D from "@src/assets/nodes/3DScatter";
// import { OrderedTripleData } from "@src/feature/common/types/ResultsType";
import REGL from "regl";

// const pointData: REGL.Vec3[] = Array(1000)
//   .fill(undefined)
//   .map(() => [Math.random() * 8, Math.random() * 8, Math.random() * 8]);

// const zip = (data: { x: number[]; y: number[]; z: number[] }) => {
//   const orderedTriple: REGL.Vec3[] = [];
//   for (let i = 0; i < data.x.length; i++) {
//     orderedTriple.push([data.x[i], data.y[i], data.z[i]]);
//   }
//   return orderedTriple;
// };

const Scatter3DNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const plot = useRef<Plot | null>(null);
  const points = useRef<Points | null>(null);
  const pointsData = useRef<REGL.Buffer | null>(null);
  const pointsLength = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pointsData.current && points.current) {
        pointsData.current.subdata(
          [Math.random() * 10, Math.random() * 10, Math.random() * 10],
          pointsLength.current * 3 * 4,
        );
        pointsLength.current++;
        points.current.pointCount = pointsLength.current;
      }
    }, 5);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (points.current && nodeResult?.result?.data) {
  //     points.current.points = zip(nodeResult.result.data as OrderedTripleData);
  //   }
  // }, [nodeResult?.result.data]);
  //
  // if (!nodeResult?.result?.data) {
  //   return (
  //     <NodeWrapper nodeError={nodeError}>
  //       <div
  //         className={clsx(
  //           "rounded-2xl bg-transparent",
  //           { "shadow-around shadow-accent2": nodeRunning || selected },
  //           { "shadow-around shadow-red-700": nodeError },
  //         )}
  //       >
  //         <Scatter3D />
  //         <HandleComponent data={data} variant="accent2" />
  //       </div>
  //     </NodeWrapper>
  //   );
  // }

  if (canvas.current && !plot.current) {
    const plt = new Plot(canvas.current);
    const buf = plt.regl.buffer({
      usage: "dynamic",
      type: "float32",
      length: 10000 * 3 * 4,
    });
    pointsData.current = buf;
    points.current = new Points(plt.regl, {
      pointSize: 5,
      points: pointsData.current,
      pointCount: pointsLength.current,
    });

    plt
      .with(points.current)
      .with(new OrthogonalPlane(plt.regl, { orientation: "xy", gridSize: 10 }))
      .with(new OrthogonalPlane(plt.regl, { orientation: "xz", gridSize: 10 }))
      .with(new OrthogonalPlane(plt.regl, { orientation: "yz", gridSize: 10 }))
      .withCamera({ center: [2.5, 2.5, 2.5] });

    plot.current = plt;

    plt.frame();
  }

  return (
    <NodeWrapper nodeError={nodeError}>
      <div
        className={clsx(
          "rounded-2xl bg-transparent",
          { "shadow-around shadow-accent2": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <canvas ref={canvas} id={`canvas-${id}`} width={360} height={224} />
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(Scatter3DNode);
