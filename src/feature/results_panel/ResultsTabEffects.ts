import { useEffect } from "react";
import { ResultTabStateReturnType } from "./ResultsTabState";
import { ResultIO } from "./types/ResultsType";

export function useResultsTabEffects({
  nodeResults,
  setResultNodes,
  nodes,
}: ResultTabStateReturnType & { nodeResults: ResultIO[] }) {
  // TODO: Reimplement this to fix debug tab
  // useEffect(() => {
  //   console.log("22");
  //   if (nodeResults && nodeResults.length > 0 && nodes.length > 0) {
  //     setResultNodes(
  //       nodes.map((node) => {
  //         const nodeResult = nodeResults?.find(
  //           (result) => result.id === node.id
  //         );
  //         return {
  //           ...node,
  //           type: "default",
  //           position: node.position,
  //           data: {
  //             ...node.data,
  //             resultData: nodeResult?.result,
  //           },
  //         };
  //       })
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nodeResults, nodes]);
}
