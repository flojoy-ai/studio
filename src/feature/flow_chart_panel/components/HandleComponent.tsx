import { Position } from "reactflow";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { Box, createStyles, Flex } from "@mantine/core";
import { CustomHandle } from "./CustomHandle";

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

const HandleComponent = ({
  data,
  colorClass,
}: {
  data: CustomNodeProps["data"];
  colorClass?: string;
}) => {
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
            <CustomHandle
              position={Position.Left}
              type="target"
              param={param}
              colorClass={colorClass ?? ""}
              style={{ left: 1 }}
            />
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
            <CustomHandle
              position={Position.Right}
              type="source"
              param={param}
              colorClass={colorClass ?? ""}
              style={{ right: 5 }}
            />
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default HandleComponent;
