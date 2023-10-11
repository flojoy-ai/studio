import HandleComponent from "@src/components/common/HandleComponent";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import Scatter3D from "@src/assets/nodes/3DScatter";
import { OrderedTripleData } from "@src/feature/common/types/ResultsType";
import { ScatterPlot3D } from "@src/lib/plot/plots/3d/scatter";
import { Vec3, Vec4 } from "regl";

const initializePlot = (
  canvas: HTMLCanvasElement,
  initialData: {
    points: Vec3[];
    colors?: Vec4 | Vec4[];
  },
  params: CustomNodeProps["data"]["ctrls"],
) => {
  return new ScatterPlot3D(canvas, initialData.points, {
    pointSize: 2,
    axes: {
      x: {
        domain: [
          params["x_min"].value as number,
          params["x_max"].value as number,
        ],
        step: params["x_step"].value as number,
      },
      y: {
        domain: [
          params["y_min"].value as number,
          params["y_max"].value as number,
        ],
        step: params["y_step"].value as number,
      },
      z: {
        domain: [
          params["z_min"].value as number,
          params["z_max"].value as number,
        ],
        step: params["z_step"].value as number,
      },
    },
    showPlanes: {
      xy: params["show_xy_plane"].value as boolean,
      xz: params["show_xz_plane"].value as boolean,
      yz: params["show_yz_plane"].value as boolean,
    },
    cameraOptions: {
      center: [2.5, 2.5, 2.5],
    },
    colors: initialData.colors,
    backgroundColor: [0.1, 0.1, 0.1, 1],
  });
};

const Scatter3DNode = ({ data, selected, id }: CustomNodeProps) => {
  const { nodeError, nodeResult } = useNodeStatus(data.id);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const scatter = useRef<ScatterPlot3D | null>(null);

  useEffect(() => {
    if (scatter.current && nodeResult?.result?.data) {
      const resultData = nodeResult.result.data as OrderedTripleData;
      const pts = resultData.v;
      const colors = resultData.extra?.colors;

      scatter.current.updateData(pts, colors);
    }
  }, [nodeResult?.result.data]);

  useEffect(() => {
    if (scatter.current) {
      scatter.current.destroy();
    }
    scatter.current = null;
  }, [data.ctrls]);

  if (!scatter.current && canvas.current && nodeResult?.result?.data) {
    const resultData = nodeResult.result.data as OrderedTripleData;
    const pts = resultData.v;
    const colors = resultData.extra?.colors;
    const plot = initializePlot(
      canvas.current,
      {
        points: pts,
        colors,
      },
      data.ctrls,
    );
    plot.frame();
    scatter.current = plot;
  }

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
