import {
  NumberInput,
  Select,
  TextInput,
  Switch,
  createStyles,
  getStylesRef,
  useMantineTheme,
} from "@mantine/core";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import { ElementsData } from "flojoy/types";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

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
  const theme = useMantineTheme();
  const { updateCtrlInputDataForNode } = useFlowChartGraph();
  const { setNodeParamChanged } = useFlowChartState();
  const handleChange = (value: string | boolean) => {
    setNodeParamChanged(true);
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
          data-testid="float-input"
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseFloat(value as string) : value}
          precision={7}
          removeTrailingZeros
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
        />
      );
    case "int":
      return (
        <NumberInput
          data-testid="int-input"
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseInt(value as string) : value}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
        />
      );
    case "bool":
      return (
        <Switch
          data-testid="boolean-input"
          onChange={(e) => handleChange(e.currentTarget.checked)}
          label={JSON.stringify(value)}
          size="md"
          classNames={classes}
          checked={Boolean(value)}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
        />
      );
    case "select":
      return (
        <Select
          data-testid="select-input"
          onChange={(val) => handleChange(val as string)}
          data={options ?? []}
          value={value as string}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
            item: {
              "&[data-selected]": {
                "&, &:hover": {
                  backgroundColor: theme.colors.accent1[0],
                  color:
                    theme.colorScheme === "dark" ? theme.black : theme.white,
                },
              },
            },
          }}
        />
      );
    case "NodeReference":
      return (
        <Select
          data-testid="node_reference-input"
          onChange={(val) => handleChange(val as string)}
          data={nodeReferenceOptions ?? []}
          value={value as string}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
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
          data-testid="object-input"
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value as string}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
        />
      );
    default:
      return <p> There&apos;s something wrong with the paramType </p>;
  }
};

export default ParamField;
