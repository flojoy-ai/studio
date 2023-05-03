import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;
  display: flex;
`;

const NodeEditButtons = () => {
  const { setIsEditMode } = useFlowChartState();

  useEffect(() => {
    return () => setIsEditMode(false);
  }, [setIsEditMode]);

  return (
    <StyledContainer>
      <IconPencil onClick={() => setIsEditMode(true)} />
      <IconX onClick={() => setIsEditMode(false)} />
    </StyledContainer>
  );
};

export default NodeEditButtons;
