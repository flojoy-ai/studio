import { Fragment } from "react";
import { Handle, Position } from "react-flow-renderer";
import { CustomNodeProps, ElementsData } from "../types/CustomNodeProps";

const HandleComponent = ({
  data,
  inputs,
}: CustomNodeProps & {
  inputs: ElementsData['inputs'];
}) => {
  const params = inputs || [];

  const isValidConnection = (connection) => {
    // connection.source to connection.target validation
    return true
  }

  return (
    <Fragment>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          display: data.func == 'LOOP' ? 'none' :'block',
          borderRadius: 0,
          height: 8,
          width: 8,
          // display: data.func == 'LOOP' && 'none'
        }}
        isValidConnection={isValidConnection}
        id="main"
      />

      <Handle
        type="target"
        position={Position.Left}
        style={{
          borderRadius: 0,
          height: 8,
          width: 8,
          ...(params.length > 0 && { top: 15 }),
        }}
        id={data.func}
        isValidConnection={isValidConnection}
      />

      {params.length > 0 &&
        params.map((param, i) => {
          if(data.func === 'LOOP'){

            return (
              <Handle
                key={param.id}
                type="source"
                position={Position.Right}
                style={{
                  gap: "5px",
                  borderRadius: 0,
                  top: 30 * (i + 1) + 40,
                  minHeight: 10,
                  display: "flex",
                  alignItems: "center",
                  background: "transparent",
                  border: 0,
                  right: '-2px'
                }}
                id={param.id}
                isValidConnection={isValidConnection}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      height: 8,
                      width: 8,
                      backgroundColor: "#000",
                      border: "1px solid #fff",
                    }}
                  ></div>
                  <div style={{ paddingLeft: "8px",transform:'translateX(-63px)' }}>{param.name}</div>

                </div>
              </Handle>
            )
          }
          else {
            return (
              <Handle
            key={param.id}
            type="target"
            position={Position.Left}
            style={{
              gap: "5px",
              borderRadius: 0,
              top: 30 * (i + 1) + 40,
              minHeight: 10,
              display: "flex",
              alignItems: "center",
              background: "transparent",
              border: 0,
            }}
            id={param.id}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  height: 8,
                  width: 8,
                  backgroundColor: "#000",
                  border: "1px solid #fff",
                }}
              ></div>
              <div style={{ paddingLeft: "8px" }}>{param.name}</div>
            </div>
          </Handle>
            )
          }
        }
        )
      }
    </Fragment>
  );
};


export default HandleComponent;