import { ElementsData } from "@/types";
import { ParamValueType } from "@feature/common/types/ParamValueType";
import { Input } from "@src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Switch } from "@src/components/ui/switch";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { NumberInput } from "./NumberInput";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";

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

const ParamField = ({
  nodeCtrl,
  nodeId,
  type,
  updateFunc,
  options,
  nodeReferenceOptions,
}: ParamFieldProps) => {
  const { setNodeParamChanged } = useFlowChartState();
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const handleChange = (value: number | string | boolean) => {
    updateFunc(nodeId, {
      ...nodeCtrl,
      value,
    });
    setNodeParamChanged(true);
    setHasUnsavedChanges(true);
  };

  const value = nodeCtrl.value;

  switch (type) {
    case "float":
      return (
        <NumberInput
          data-testid="float-input"
          onChange={(x) => handleChange(x)}
          value={value as number | string}
          precision={7}
          floating
          className="border-none focus-visible:ring-accent1 focus-visible:ring-offset-1"
        />
      );
    case "int":
      return (
        <NumberInput
          data-testid="int-input"
          onChange={(x) => handleChange(x)}
          value={value as number | string}
          className="border-none focus-visible:ring-accent1 focus-visible:ring-offset-1"
        />
      );
    case "bool":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            data-testid="boolean-input"
            onCheckedChange={(val) => handleChange(val)}
            className="data-[state=checked]:bg-accent1"
            checked={Boolean(value)}
          />
          <div>
            {value === undefined || value === null ? "" : value.toString()}
          </div>
        </div>
      );
    case "select":
      return (
        <Select onValueChange={handleChange}>
          <SelectTrigger className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1">
            <SelectValue placeholder={value} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {(options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "NodeReference":
      return (
        <Select onValueChange={handleChange}>
          <SelectTrigger className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 ">
            <SelectValue placeholder={value} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {(nodeReferenceOptions ?? []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "str":
    case "list[int]":
    case "list[float]":
    case "list[str]":
    case "Array":
    case "unknown":
      return (
        <Input
          data-testid="object-input"
          className="border-none focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
          onChange={(e) => handleChange(e.target.value)}
          value={value as string}
        />
      );
    default:
      return <p> There&apos;s something wrong with the paramType </p>;
  }
};

export default ParamField;
