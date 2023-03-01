import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { CSSProperties } from "react";
import { DetailsButtonSVG } from "../../svgs/details-button-svg";
import { NodeDeleteSVG } from "../../svgs/node-delete-svg";

type params = {
  data?: any;
  uiTheme: string;
  children: any;
  rootStyle: CSSProperties;
  childStyle?: CSSProperties;
  childClassName?: string;
};

const NodeWrapper = ({
  data,
  uiTheme,
  children,
  rootStyle,
  childStyle,
  childClassName,
}: params) => {
  return (
    <div style={{ ...rootStyle }}>
      <div className={childClassName} style={{ ...childStyle }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px",
              width: "100%",
              top: "0",
              position: "absolute",
              right: 0,
              borderBottom: "1px solid",
              height: "40px",
            }}
          >
            {data && (
              <div
                style={{
                  padding: "10px",
                  left: 0,
                  position: "absolute",
                }}
              >
                <div>{data.label}</div>
              </div>
            )}
            <div
              style={{
                paddingTop: "10px",
                zIndex: "999",
              }}
            >
              <DetailsButtonSVG theme={uiTheme} />
              <NodeDeleteSVG theme={uiTheme} />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default NodeWrapper;
