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

  return (
    <Fragment>

      {
        /**
         *
         * Rendering target handle.
         *  If its conditional render two target handle (x,y)
         *  otherwise render one target handle
         *
         */
      }

      {params.length > 0 ?
        data.func === 'CONDITIONAL' ? (
        params.map((param, i) => {

          if (param.type === 'target'){

            return (
              <Handle
                key={param.id}
                type={param.type}
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
                  right: '-2px'
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
                  <div
                    style={{
                      paddingLeft: "8px",
                      // transform:'translateX(-63px)'
                    }}
                    >
                      {param.name}
                    </div>

                </div>
              </Handle>
            )
          }
        }
        )):
        (
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
          />
        )
        :
        (
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
          />
        )
      }



      <Handle
        type="source"
        position={Position.Right}
        style={{
          display: data.func === 'LOOP' || data.func === 'CONDITIONAL' ? 'none' :'block',
          borderRadius: 0,
          height: 8,
          width: 8,
        }}
        id="main"
      />


      {
        /**
         *
         * Rendering Source Handles.
         *  If its conditional render two source handle, ( true, false)
         *  If its loop render two source hanles ( body,end)
         *  otherwise render one single handle
         */
      }

      {params.length > 0 &&
        params.map((param, i) => {
          if(data.func === 'LOOP' || data.func === 'CONDITIONAL'){
            if (param.type === 'source'){
              return (
                <Handle
                  key={param.id}
                  type={param.type}
                  position={Position.Right}
                  style={{
                    gap: "5px",
                    borderRadius: 0,
                    top: 30 * (i + 1) + 90,
                    minHeight: 10,
                    display: "flex",
                    alignItems: "center",
                    background: "transparent",
                    border: 0,
                    right: '-2px'
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
                    <div style={{ paddingLeft: "8px",transform:'translateX(-63px)' }}>{param.name}</div>
                  </div>
                </Handle>
              )
            }
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