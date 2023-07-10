import { Handle, Position } from "reactflow";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { Box, createStyles, Flex } from "@mantine/core";

const useStyles = createStyles(() => ({
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
    <>
      <Box className={classes.handleWrapper} left={-6}>
        {inputs.map((param) => (
          <Flex
            key={`input-${data.id}-${param.name}`}
            align="center"
            pos="relative"
          >
            <Handle
              position={Position.Left}
              type="target"
              id={param.id}
              // Needs to be inline style for it to actually override the default react flow styles...
              style={{
                border: "1px solid lightgray",
                width: 12,
                height: 12,
                borderRadius: 0,
                left: 0,
              }}
            />
            <Box pos="absolute" left={20} bottom={-12}>
              {param.name !== "default" ? param.name : ""}
            </Box>
          </Flex>
        ))}
      </Box>

      <Box className={classes.handleWrapper} right={-10}>
        {outputs.map((param) => (
          <Flex
            key={`input-${data.id}-${param.name}`}
            align="center"
            pos="relative"
          >
            <Box pos="absolute" right={20}>
              {param.name !== "default" ? param.name : ""}
            </Box>
            <Handle
              position={Position.Right}
              type="source"
              id={param.id}
              // Needs to be inline style for it to actually override the default react flow styles...
              style={{
                border: "1px solid lightgray",
                width: 12,
                height: 12,
                borderRadius: 0,
                right: 4,
              }}
            />
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default HandleComponent;
