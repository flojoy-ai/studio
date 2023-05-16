import { Box } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconPencil, IconX } from "@tabler/icons-react";

const NodeEditButtons = () => {
  const { setIsEditMode } = useFlowChartState();

  return (
    <Box pos="absolute" top={3} right={3} display="flex">
      <IconPencil onClick={() => setIsEditMode(true)} />
      <IconX onClick={() => setIsEditMode(false)} />
    </Box>
  );
};

export default NodeEditButtons;
