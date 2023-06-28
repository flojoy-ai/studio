import { Fragment } from "react";
import { Handle, Position } from "reactflow";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { Box, createStyles, Flex } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  handleWrapper: {
    position: "absolute",
    height: "100%",
    display: "flex",
    top: 0,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
}));

const HandleComponent = ({ data }: { data: CustomNodeProps["data"] }) => {
  const outputs = data.outputs ?? [];
  const inputs = data.inputs ?? [];

  const { classes } = useStyles();

  return (
    <Fragment>
      {/**
       *
       * Rendering source handle.
       *  If it has multiple handles render them
       *  otherwise render one source handle
       * Rendering source handle.
       *  If it has multiple handles render them
       *  otherwise render one source handle
       *
       */}
      <Box className={classes.handleWrapper} left={-6}>
        {inputs.map((param) => (
          <Flex key={`input-${data.id}-${param.name}`} mt={4} align="center">
            <Handle
              position={Position.Left}
              type="target"
              id={param.id}
              // Needs to be inline style for it to actually override the default react flow styles...
              style={{
                position: "static",
                border: "1px solid lightgray",
                width: 12,
                height: 12,
                borderRadius: 0,
              }}
            />
            <Box mb={12} ml={4}>
              {param.name !== "default" ? param.name : ""}
            </Box>
          </Flex>
        ))}
      </Box>

      <Box className={classes.handleWrapper} right={-10}>
        {outputs.map((param) => (
          <Flex key={`input-${data.id}-${param.name}`} mt={4} align="center">
            <Handle
              position={Position.Right}
              type="source"
              id={param.id}
              // Needs to be inline style for it to actually override the default react flow styles...
              style={{
                position: "static",
                border: "1px solid lightgray",
                width: 12,
                height: 12,
                borderRadius: 0,
              }}
            />
            <Box mb={12} ml={4}>
              {param.name !== "default" ? param.name : ""}
            </Box>
          </Flex>
        ))}
      </Box>
      {/**
       *
       * Rendering target handle.
       *  If it has multiple handles render them
       *  otherwise render one target handle
       *
       */}
    </Fragment>
  );
};

export default HandleComponent;
