import {
  NumberInput,
  Select,
  TextInput,
  Switch,
  useMantineTheme,
  createStyles,
  MantineProvider,
} from "@mantine/core";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { ParamValueType } from "@feature/common/types/ParamValueType";

type ParamFieldProps = {
  nodeId: string;
  paramId: string;
  functionName: string;
  type: ParamValueType;
  value: any;
  options?: string[];
  nodeReferenceOptions?: {
    label: string;
    value: string;
  }[];
};
//
// const useStyles = createStyles((theme) => {
//   return {
//     input: {
//       backgroundColor: "gray",
//     },
//     root: {
//       color: "gray",
//     },
//   };
// });

const ParamField = ({
  nodeId,
  paramId,
  functionName,
  type,
  value,
  options,
  nodeReferenceOptions,
}: ParamFieldProps) => {
  const { updateCtrlInputDataForNode } = useFlowChartGraph();
  const handleChange = (value: string | boolean) => {
    updateCtrlInputDataForNode(nodeId, paramId, {
      functionName,
      param: paramId,
      value,
    });
  };
  const theme = useMantineTheme();
  //const { classes } = useStyles();

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
    case "array":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value}
        />
      );
    case "boolean":
      return (
        <MantineProvider
          theme={{
            colors: {
              accent1: theme.colors.accent1,
              accent2: theme.colors.accent2,
            },
          }}
        >
          <Switch
            onChange={(e) => handleChange(e.currentTarget.checked)}
            label={JSON.stringify(value)}
            onLabel="T"
            offLabel="F"
            size="md"
            color="accent1.1"
          />
        </MantineProvider>
      );
    case "select":
      return (
        <Select
          onChange={(val) => handleChange(val as string)}
          data={options ?? []}
          value={value}
        />
      );
    case "node_reference":
      return (
        <Select
          onChange={(val) => handleChange(val as string)}
          data={nodeReferenceOptions ?? []}
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
