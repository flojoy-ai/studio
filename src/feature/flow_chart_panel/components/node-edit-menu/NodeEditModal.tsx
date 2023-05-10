import { useMantineTheme } from "@mantine/styles";
import { Node } from "reactflow";
import { ElementsData } from "../../types/CustomNodeProps";
import { FUNCTION_PARAMETERS } from "../../manifest/PARAMETERS_MANIFEST";
import ParamField, { ParamType } from "./ParamField";
import styled from "styled-components";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

type NodeEditModalProps = {
  node: Node<ElementsData>;
};

const StyledModal = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  height: 684px;
  width: 324px;
  padding: 8px 8px;
  background-color: ${(props) =>
    props.theme === "dark" ? "#141313ff" : "white"};
  box-shadow: ${(props) =>
    props.theme === "dark" ? "none" : "0px 0px 16px 0px rgba(0,0,0,0.3)"};
`;

const StyledTitle = styled.h4`
  font-weight: 700;
  margin: 0;
  text-align: center;
`;

const StyledTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 10px 0;
`;

const StyledParamName = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const StyledCloseButton = styled.div`
  width: fit-content;
  height: 18px;
  margin-left: auto;
  cursor: pointer;
`;

const NodeEditModal = ({ node }: NodeEditModalProps) => {
  const theme = useMantineTheme();
  const { setIsEditMode } = useFlowChartState();

  return (
    <StyledModal theme={theme.colorScheme}>
      <StyledCloseButton onClick={() => setIsEditMode(false)}>
        <IconX size={18} />
      </StyledCloseButton>
      <div style={{ padding: "0px 16px 24px 16px" }}>
        <div key={node.id}>
          <StyledTitleContainer>
            <StyledTitle>{node.data.func.toUpperCase()}</StyledTitle>
            <IconPencil
              size={18}
              style={{ marginLeft: "1rem", marginBottom: "4px" }}
            />
          </StyledTitleContainer>
          {Object.entries(FUNCTION_PARAMETERS[node.data.func]).map(
            ([name, param]) => (
              <div key={node.id + name}>
                <StyledParamName>{`${name.toUpperCase()}:`}</StyledParamName>
                <ParamField
                  nodeId={node.id}
                  paramId={name}
                  functionName={node.data.func}
                  type={param.type as ParamType}
                  value={node.data.ctrls[name].value}
                  options={param.options}
                />
              </div>
            )
          )}
        </div>
      </div>
    </StyledModal>
  );
};

export default NodeEditModal;
