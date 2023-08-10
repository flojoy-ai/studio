import {
  NumberInput,
  Select,
  TextInput,
  Switch,
  createStyles,
  getStylesRef,
  useMantineTheme,
} from "@mantine/core";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import { ElementsData } from "flojoy/types";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

type ParamFieldProps = {
  nodeId: string;
  nodeCtrl: ElementsData["ctrls"][string];
  type: ParamValueType;
  updateFunc: (nodeId: string, data: ElementsData["ctrls"][string]) => void;
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
  nodeCtrl,
  nodeId,
  type,
  updateFunc,
  options,
  nodeReferenceOptions,
}: ParamFieldProps) => {
  const theme = useMantineTheme();
  const { setNodeParamChanged } = useFlowChartState();
  const handleChange = (value: string | boolean) => {
    setNodeParamChanged(true);
    updateFunc(nodeId, {
      ...nodeCtrl,
      value,
    });
  };

  const { classes } = useStyles();
  const value = nodeCtrl.value;

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
