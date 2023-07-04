import { Checkbox, NumberInput, Select, TextInput } from "@mantine/core";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";

type ParamFieldProps = {
  nodeId: string;
  nodeCtrls: ElementsData["ctrls"][""];
  type: ParamValueType;
  value: ElementsData["ctrls"][""]["value"];
  options?: string[];
  nodeReferenceOptions?: {
    label: string;
    value: string;
  }[];
};

// TODO: Add support for unions on the frontend
const ParamField = ({
  nodeCtrls,
  nodeId,
  type,
  value,
  options,
  nodeReferenceOptions,
}: ParamFieldProps) => {
  const { updateCtrlInputDataForNode } = useFlowChartGraph();
  const handleChange = (value: string | boolean) => {
    updateCtrlInputDataForNode(nodeId, {
      ...nodeCtrls,
      value,
    });
  };
  switch (type) {
    case "float":
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseFloat(value as string) : value}
          precision={7}
          removeTrailingZeros
        />
      );
    case "int":
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseInt(value as string) : value}
        />
      );
    case "string":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value as string}
        />
      );
    case "list[int]":
    case "list[str]":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value as string}
        />
      );
    case "boolean":
      return (
        <Checkbox
          onChange={(e) => handleChange(e.currentTarget.checked)}
          label={JSON.stringify(value)}
          checked={value as boolean}
        />
      );
    case "select":
      return (
        <Select
          onChange={(val) => handleChange(val as string)}
          data={options ?? []}
          value={value as string}
        />
      );
    case "node_reference":
      return (
        <Select
          onChange={(val) => handleChange(val as string)}
          data={nodeReferenceOptions ?? []}
          value={value as string}
        />
      );
    case "unknown":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value as string}
        />
      );
    default:
      return <p> There&apos;s something wrong with the paramType </p>;
  }
};

export default ParamField;
