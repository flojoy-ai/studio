import { useEffect, useState } from "react";
import { useSocket } from "@src/hooks/useSocket";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import HandleComponent from "../components/HandleComponent";
import NodeComponent from "../components/NodeComponent";
import { NodeStyle } from "../style/NodeStyle";
import { CustomNodeProps, ElementsData } from "../types/CustomNodeProps";

const highlightShadow = {
  'LINSPACE': {boxShadow: '0 0 50px 15px #48abe0'},
  'HISTOGRAM': {boxShadow: '0 0 50px 15px #48abe0'},
  'SCATTER': {boxShadow: '0 0 50px 15px #48abe0'},
  'SURFACE3D': {boxShadow: '0 0 50px 15px #48abe0'},
  'SCATTER3D': {boxShadow: '0 0 50px 15px #48abe0'},
  'BAR': {boxShadow: '0 0 50px 15px #48abe0'},
  'LINE': {boxShadow: '0 0 50px 15px #48abe0'},
  'SINE': {boxShadow: 'rgb(116 24 181 / 97%) 0px 0px 50px 15px'},
  'RAND': {boxShadow: 'rgb(116 24 181 / 97%) 0px 0px 50px 15px'},
  'CONSTANT': {boxShadow: 'rgb(116 24 181 / 97%) 0px 0px 50px 15px'},
  'MULTIPLY': {boxShadow: 'rgb(112 96 13) 0px 0px 50px 15px', background: '#78640f96'},
  'ADD': {boxShadow: 'rgb(112 96 13) 0px 0px 50px 15px', background: '#78640f96'},
  'LOOP':{boxShadow: '0 0 50px 15px #48abe0', backgroundColor:'blue'},
  'CONDITIONAL' : {boxShadow: '0 0 50px 15px #48abe0', backgroundColor:'yellow'},
  'TIMER':{boxShadow: '0 0 50px 15px #48abe0', backgroundColor:'grey'},
  'LOCAL_FILE':{boxShadow: '0 0 50px 15px #48abe0', backgroundColor:'#78640f96'},
  'OBJECT_DETECTION':{boxShadow: '0 0 50px 15px #48abe0', backgroundColor:'#78640f96'}
}
const getboxShadow = (data: ElementsData) =>{
  return highlightShadow[data.func]
}


const CustomNode = ({ data }: CustomNodeProps) => {

  const [additionalInfo,setAdditionalInfo] = useState({})

  const { uiTheme, runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  const { states } = useSocket();
  const { programResults } = states!;

  useEffect(()=>{
    if(programResults?.io?.length! > 0){

      let programAdditionalInfo = {}

      const results = programResults?.io
      results?.forEach(element => {
          programAdditionalInfo = {...programAdditionalInfo,[element.id]:element['additional_info']}
      });      
      setAdditionalInfo(programAdditionalInfo)
    }
  },[programResults])

  return (
    <div style={{
      ...(runningNode === data.id && getboxShadow(data)),
      ...(failedNode === data.id && {
        boxShadow: 'rgb(183 0 0) 0px 0px 50px 15px'
      })
    }}>
    <div
      style={{
        position: "relative",
        ...NodeStyle(data, uiTheme),
        height: "fit-content",
        minHeight: 115,
        ...(params.length > 0 && { padding:'0px 0px 8px 0px' }),
      }}
    >
      <NodeComponent data={data} uiTheme={uiTheme} params={params} additionalInfos={additionalInfo}/>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: params.length > 0 ? (params.length + 1) * 40 : "fit-content",
        }}
      >
        <HandleComponent data={data} inputs={params} />
      </div>
    </div>
    </div>
  );
};

export default CustomNode;