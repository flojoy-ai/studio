import { Checkbox, NumberInput, Select, TextInput } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ParamValueType } from "@feature/common/types/ParamValueType";

type ParamFieldProps = {
  nodeId: string;
  paramId: string;
  functionName: string;
  type: ParamValueType;
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
  const { updateCtrlInputDataForNode } = useFlowChartState();
  const handleChange = (value: string) => {
    updateCtrlInputDataForNode(nodeId, paramId, {
      functionName: functionName,
      param: paramId,
      value: value,
      ValType: type,
    });
  };
  switch (type) {
    case ParamValueType.float:
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseFloat(value) : value}
          precision={7}
          removeTrailingZeros
        />
      );
    case ParamValueType.int:
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseInt(value) : value}
        />
      );
    case ParamValueType.string:
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value}
        />
      );
    case ParamValueType.boolean:
      return (
        <Checkbox
          onChange={(e) => handleChange(e.currentTarget.checked.toString())}
        />
      );
    case ParamValueType.select:
      return <Select onChange={handleChange} data={options!} value={value} />;
    case ParamValueType.unknown:
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value}
        />
      );
    default:
      return <p> There's something wrong with the paramType </p>;
  }
};

export default ParamField;
