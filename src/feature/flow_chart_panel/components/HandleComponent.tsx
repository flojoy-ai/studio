import { Fragment } from "react";
import { Handle, HandleType, Position } from "reactflow";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { v4 as uuidV4 } from "uuid";

const HandleComponent = ({ data }: { data: CustomNodeProps["data"] }) => {
  const sourceParams =
    data.inputs?.filter((input) => (input.type as HandleType) === "source") ??
    [];
  const targetParams =
    data.inputs?.filter((input) => (input.type as HandleType) === "target") ??
    [];

  return (
    <Fragment>
      {/**
       *
       * Rendering source handle.
       *  If it has multiple handles render them
       *  otherwise render one source handle
       *
       */}

      {sourceParams.length ? (
        sourceParams.map((param, index) => (
          <Handle
            key={`${param.id}_${uuidV4()}`}
            type={param.type as HandleType}
            position={Position.Right}
            style={{
              right: "-2px",
              left: index >= 2 ? "0" : "auto",
              margin: "auto",
              bottom: `${(sourceParams.length - 1 - index) * 80}px`,
              gap: "5px",
              borderRadius: 0,
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
                  height: 15,
                  width: 15,
                  backgroundColor: "#000",
                  border: "1px solid #fff",
                }}
              ></div>
              <div
                style={{
                  paddingLeft: "8px",
                  transform: "translateX(-63px)",
                }}
              >
                {param.name}
              </div>
            </div>
          </Handle>
        ))
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            borderRadius: 0,
            height: 15,
            width: 15,
          }}
          id="main"
        />
      )}
      {/**
       *
       * Rendering target handle.
       *  If it has multiple handles render them
       *  otherwise render one target handle
       *
       */}

      {targetParams.length ? (
        targetParams.map((param, index) => (
          <Handle
            key={`${param.id}_${uuidV4()}`}
            type={param.type as HandleType}
            position={Position.Left}
            style={{
              left: "-9px",
              right: index >= 2 ? "0" : "auto",
              margin: "auto",
              bottom: `${(targetParams.length - 1 - index) * 80}px`,
              gap: "5px",
              borderRadius: 0,
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
                  height: 15,
                  left: "-9px",
                  width: 15,
                  backgroundColor: "#000",
                  border: "1px solid #fff",
                }}
              ></div>
              <div
                style={{
                  paddingLeft: "8px",
                }}
              >
                {param.name}
              </div>
            </div>
          </Handle>
        ))
      ) : (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            borderRadius: 0,
            height: 15,
            width: 15,
            left: "-9px",
          }}
          id={`${data.func}_target`}
        />
      )}
    </Fragment>
  );
};

export default HandleComponent;
