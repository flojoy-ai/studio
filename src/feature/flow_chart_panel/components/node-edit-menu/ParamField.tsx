import {
  NumberInput,
  Select,
  TextInput,
  Switch,
  useMantineTheme,
  createStyles,
  MantineProvider,
  getStylesRef,
} from "@mantine/core";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { darkTheme, lightTheme } from "@feature/common/theme";

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

const useStyles = createStyles((theme) => ({
  input: {
    [`&:checked + .${getStylesRef("track")}`]: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[0]
          : theme.colors.accent2[2],
      borderColor:
        theme.colorScheme === "dark" ? theme.colors.dark : theme.colors.gray[1],
    },
  },
  track: {
    ref: getStylesRef("track"),
  },
}));

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

  const { classes } = useStyles();

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
    case "bool":
      return (
        <Switch
          onChange={(e) => handleChange(e.currentTarget.checked)}
          label={JSON.stringify(value)}
          size="md"
          classNames={classes}
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
    case "NodeReference":
      return (
        <Select
          onChange={(val) => handleChange(val as string)}
          data={nodeReferenceOptions ?? []}
          value={value as string}
        />
      );
    case "str":
    case "list[int]":
    case "list[float]":
    case "list[str]":
    case "Array":
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
