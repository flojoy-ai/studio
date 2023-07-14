import { Handle, Position } from "reactflow";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { Box, createStyles, Flex } from "@mantine/core";
import { twMerge } from "tailwind-merge";

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
  className,
}: {
  data: CustomNodeProps["data"];
  className: string;
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
            <Handle
              position={Position.Left}
              type="target"
              id={param.id}
              // Needs to be inline style for it to actually override the default react flow styles...
              className={twMerge("!w-3 !h-3 !border-2", className)}
              style={{ left: 1 }}
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
              className={twMerge("!w-3 !h-3 !border-2", className)}
              style={{ right: 5 }}
            />
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default HandleComponent;
