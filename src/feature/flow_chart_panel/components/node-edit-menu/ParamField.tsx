import { Checkbox, NumberInput, Select, TextInput } from "@mantine/core";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamValueType } from "@feature/common/types/ParamValueType";

type ParamFieldProps = {
  nodeId: string;
  paramId: string;
  functionName: string;
  type: ParamValueType;
  value: any;
  options?: string[];
  otherNodeLabels?: string[];
};

const ParamField = ({
  nodeId,
  paramId,
  functionName,
  type,
  value,
  options,
  otherNodeLabels,
}: ParamFieldProps) => {
  const { updateCtrlInputDataForNode } = useFlowChartGraph();
  const handleChange = (value: string) => {
    updateCtrlInputDataForNode(nodeId, paramId, {
      functionName,
      param: paramId,
      value,
      valType: type,
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
      return (
        <Select onChange={handleChange} data={options ?? []} value={value} />
      );
    case "node_reference":
      return (
        <Select
          onChange={handleChange}
          data={otherNodeLabels ?? []}
          value={value}
        />
      );
    case "unknown":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value}
        />
      );
    default:
      return <p> There&apos;s something wrong with the paramType </p>;
  }
};

export default ParamField;
