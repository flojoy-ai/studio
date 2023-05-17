import { Select, TextInput, NumberInput, Checkbox } from "@mantine/core";
import { useFlowChartNodes } from "@src/hooks/useFlowChartNodes";

export type ParamType = "float" | "int" | "string" | "boolean" | "select";

type ParamFieldProps = {
  nodeId: string;
  paramId: string;
  functionName: string;
  type: ParamType;
  value: any;
  options?: string[];
};

const ParamField = ({
  nodeId,
  paramId,
  functionName,
  type,
  value,
  options,
}: ParamFieldProps) => {
  const { updateCtrlInputDataForNode } = useFlowChartNodes();
  const handleChange = (value: string) => {
    updateCtrlInputDataForNode(nodeId, paramId, {
      functionName,
      param: paramId,
      value,
    });
  };
  switch (type) {
    case "float":
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseFloat(value) : value}
          precision={7}
          removeTrailingZeros
        />
      );
    case "int":
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseInt(value) : value}
        />
      );
    case "string":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value}
        />
      );
    case "boolean":
      return (
        <Checkbox
          onChange={(e) => handleChange(e.currentTarget.checked.toString())}
        />
      );
    case "select":
      return <Select onChange={handleChange} data={options!} value={value} />;
  }
};

export default ParamField;
