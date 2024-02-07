import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { Download } from "lucide-react";
import nodeTypes from "./nodes/nodeTypes";

type AppDisplayProps = {
  app: any;
  blockName: string;
};

const FlowMiniMap = () => {
  return (
    <MiniMap
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        height: 80,
        width: 150,
      }}
      nodeColor="rgba(255, 255, 255, 0.25)"
      maskColor="rgba(255, 255, 255, 0.05)"
      zoomable
      pannable
    />
  );
};

const AppDisplay = ({ app, blockName }: AppDisplayProps) => {
  const appObject = app["rfInstance"];

  if (!appObject) {
    const errMsg = `Invalid app.json found for ${blockName}, please double check and try again.`;
    console.error(errMsg);
    return (
      <div className="flex items-center justify-center gap-2 rounded border border-transparent bg-gray-100 p-2 transition duration-300 hover:border-accent1 dark:bg-gray-800">
        {errMsg}
      </div>
    );
  }

  const nodes = appObject["nodes"];
  const edges = appObject["edges"];

  const download = () => {
    const jsonString = JSON.stringify(app, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blockName.toLowerCase()}_example.fj`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="not-content mt-6 flex flex-col">
      <div>
        <div className="flex justify-center">
          <div style={{ width: "100vw", height: 400 }} className="">
            <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              minZoom={0.25}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <FlowMiniMap />
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
      <div className="py-2" />
      <button
        className="flex items-center justify-center gap-2 rounded border border-transparent bg-gray-100 p-2 transition duration-300 hover:border-accent1 dark:bg-gray-800"
        onClick={download}
      >
        <div>Download this Flojoy App</div>
        <Download />
      </button>
    </div>
  );
};

export default AppDisplay;
