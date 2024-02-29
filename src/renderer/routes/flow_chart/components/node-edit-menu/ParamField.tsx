import { BlockData } from "@/renderer/types";
import { ParamValueType } from "@/renderer/routes/common/types/ParamValueType";
import { Input } from "@/renderer/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { Switch } from "@/renderer/components/ui/switch";
import { NumberInput } from "./NumberInput";
import { SecretSelect } from "./SecretSelect";
import { CameraSelect } from "./CameraSelect";
import { SerialDeviceSelect } from "./SerialDeviceSelect";
import { VisaDeviceSelect } from "./VisaDeviceSelect";
import { NIDAQmxDeviceSelect } from "./NIDAQmxDeviceSelect";
import { NIDMMDeviceSelect } from "./NIDMMDeviceSelect";
import { Button } from "@/renderer/components/ui/button";
import { AutosizingTextarea } from "./AutosizingTextarea";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import { Result } from "@/types/result";
import { toast } from "sonner";
import { BlockParameterValue } from "@/renderer/types/node";
import { useShallow } from "zustand/react/shallow";

type ParamFieldProps = {
  nodeId: string;
  nodeCtrl: BlockData["ctrls"][string];
  type: ParamValueType;
  updateFunc: (
    nodeId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void>;
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
  const { markNodeParamChanged } = useFlowchartStore(
    useShallow((state) => ({
      markNodeParamChanged: state.markNodeParamChanged,
    })),
  );

  const handleChange = (value: number | string | boolean) => {
    const res = updateFunc(nodeId, nodeCtrl.param, value);
    if (res.isErr()) {
      toast.error(
        `Error when trying to update parameter: ${res.error.message}`,
      );
    }

    markNodeParamChanged();
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
          <SelectTrigger
            className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
            data-testid="select-input"
          >
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
          <SelectTrigger
            className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 "
            data-testid="node-reference-input"
          >
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
    case "File":
      return (
        <div className="flex items-center justify-between gap-2.5">
          <Input
            data-testid="file-input"
            className="border-none focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
            onChange={(e) => handleChange(e.target.value)}
            value={value as string}
          />
          <Button
            variant={"secondary"}
            onClick={() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = `*`; //TODO: we should get the file type from the select and use it here
              fileInput.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  const file = files[0];
                  const path = file.path;
                  handleChange(path);
                }
              };
              fileInput.click();
            }}
          >
            Browse
          </Button>
        </div>
      );

    case "Directory":
      return (
        <div className="flex items-center justify-between gap-2.5">
          <Input
            data-testid="dir-input"
            className="border-none focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
            onChange={(e) => handleChange(e.target.value)}
            value={value as string}
          />
          <Button
            variant={"secondary"}
            onClick={async () => {
              const dir = await window.api.pickDirectory();
              handleChange(dir);
            }}
          >
            Browse
          </Button>
        </div>
      );
    case "TextArea":
      return (
        <AutosizingTextarea
          onValueChange={handleChange}
          value={value as string}
        />
      );
    case "Secret":
      return <SecretSelect onValueChange={handleChange} value={value} />;
    case "CameraDevice":
    case "CameraConnection":
      return <CameraSelect onValueChange={handleChange} value={value} />;
    case "SerialDevice":
    case "SerialConnection":
      return <SerialDeviceSelect onValueChange={handleChange} value={value} />;
    case "VisaDevice":
    case "VisaConnection":
      return <VisaDeviceSelect onValueChange={handleChange} value={value} />;
    case "NIDAQmxDevice":
      return <NIDAQmxDeviceSelect onValueChange={handleChange} value={value} />;
    case "NIDMMDevice":
    case "NIConnection":
      return <NIDMMDeviceSelect onValueChange={handleChange} value={value} />;
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
