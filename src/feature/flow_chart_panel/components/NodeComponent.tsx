import { Fragment, useEffect } from "react";
import Scatter3D from "./nodes/3d-scatter";
import Surface3D from "./nodes/3d-surface";
import BarChart from "./nodes/bar";
import Histogram from "./nodes/Histogram";
import LineChart from "./nodes/line-chart";
import Scatter from "./nodes/Scatter";
import { AddBGTemplate, AddSvg, MultiplySvg } from "../svgs/add-multiply-svg";
import { BGTemplate } from "../svgs/histo-scatter-svg";
import { CustomNodeProps, ElementsData } from "../types/CustomNodeProps";

const NodeComponent = ({
  data,
  uiTheme,
  params,
  additionalInfos
}: CustomNodeProps & {
  uiTheme: any;
  params: ElementsData['inputs'];
  additionalInfos:any
}) => {

  if (data.func === "MULTIPLY" || data.func === "ADD") {
    return (
      <Fragment>
        <AddBGTemplate />
        {data.func === "MULTIPLY" && (
          <MultiplySvg
            style={{
              position: "absolute",
              top: "47px",
              left: "29px",
              height: "19px",
              width: "18px",
            }}
          />
        )}
        {data.func === "ADD" && (
          <AddSvg
            style={{
              position: "absolute",
              top: "47px",
              left: "29px",
              height: "19px",
              width: "18px",
            }}
          />
        )}
      </Fragment>
    );
  }
  if (data.type === "VISOR") {
    return (
      <Fragment>
        {data.func === "SCATTER" && <Scatter theme={uiTheme} />}
        {data.func === "HISTOGRAM" && <Histogram theme={uiTheme} />}
        {data.func === "LINE" && <LineChart theme={uiTheme} />}
        {data.func === "SURFACE3D" && <Surface3D theme={uiTheme} />}
        {data.func === "SCATTER3D" && <Scatter3D theme={uiTheme} />}
        {data.func === "BAR" && <BarChart theme={uiTheme} />}
        <BGTemplate theme={uiTheme} />
      </Fragment>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "5px",
        width: "100%",
        flexDirection:'column'
      }}
    >
      <div>
        {data.label}
      </div>
      <div>
        {
          data.func == 'CONDITIONAL' && (
            <>
              {
                params?.length !== 0 ? (
                  <p>
                    x {data['ctrls']['CONDITIONAL_CONDITIONAL_operator_type']['value']} y
                  </p>
                ) : (
                  <>
                    {
                      Object.keys(additionalInfos).map((value,index)=>{
                        if(value === data.id){
                          return (
                            <p key={index+1}>
                              status: {
                                additionalInfos[data.id]['status']
                              }
                            </p>
                          )
                        }
                      })
                    }
                  </>
                )
              }
            </>
          )
        }
        {
          data.func == 'TIMER' && (
            <p>
              {data['ctrls']['TIMER_TIMER_sleep_time']['value']}s
            </p>
          )
        }
        {
          data.func == 'LOOP' && (
            <div>
              <p>Total Iteration: {data['ctrls']['LOOP_LOOP_iteration_count']['value']}</p>
              <>
                {
                  Object.keys(additionalInfos).map((value,index)=>{
                    if(value === data.id){
                      if(Object.keys(additionalInfos[data.id]).length > 1){
                        if (additionalInfos[data.id]['current_iteration'] !== data['ctrls']['LOOP_LOOP_initial_count']['value']){
                          return (
                            <p key={index+1}>
                              Current Iteration: {
                                additionalInfos[data.id]['current_iteration']
                              }
                            </p>
                          )
                        }
                      }
                    }
                  })
                }
              </>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default NodeComponent;