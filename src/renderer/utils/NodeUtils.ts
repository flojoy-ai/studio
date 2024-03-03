import { v4 as uuidv4 } from "uuid";
import { Leaf as NodeElement } from "@/renderer/types/manifest";
import { CtrlData, ParamDefinition } from "@/renderer/types/node";
import { DeviceInfo } from "@/renderer/types/hardware";

export const createNodeId = (nodeFunc: string) => `${nodeFunc}-${uuidv4()}`;

const firstMissingPositive = (nums: number[]): number => {
  let i = 0;
  const n = nums.length;

  while (i < n) {
    if (nums[i] < n && nums[nums[i]] !== nums[i]) {
      const tmp = nums[i];
      nums[i] = nums[tmp];
      nums[tmp] = tmp;
    } else {
      i++;
    }
  }

  for (let i = 0; i < n; i++) {
    if (nums[i] != i) {
      return i;
    }
  }
  return n;
};

export const createNodeLabel = (nodeFunc: string, takenLabels: string[][]) => {
  const nums = takenLabels.map((l) =>
    l[1] !== undefined ? parseInt(l[1]) : 0,
  );
  const availableNum = firstMissingPositive(nums);

  const nodeLabel = availableNum > 0 ? `${nodeFunc} ${availableNum}` : nodeFunc;

  return nodeLabel.replaceAll("_", " ");
};

export const ctrlsFromParams = (
  params: NodeElement["parameters"] | undefined,
  funcName: string,
  devices?: DeviceInfo,
): CtrlData => {
  if (!params) {
    return {};
  }

  const getDefault =
    devices === undefined
      ? (param: ParamDefinition) => param.default ?? ""
      : (param: ParamDefinition) => {
          switch (param.type) {
            case "CameraDevice":
            case "CameraConnection":
              return devices.cameras.length === 1 ? devices.cameras[0].id : "";
            case "SerialDevice":
            case "SerialConnection":
              return devices.serialDevices.length === 1
                ? devices.serialDevices[0].port
                : "";
            case "VisaDevice":
            case "VisaConnection":
              return devices.visaDevices.length === 1
                ? devices.visaDevices[0].address
                : "";
            case "NIDAQmxDevice":
              return devices.nidaqmxDevices.length === 1
                ? devices.nidaqmxDevices[0].address
                : "";
            case "NIDMMDevice":
            case "NIConnection":
              return devices.nidmmDevices.length === 1
                ? devices.nidmmDevices[0].address
                : "";
            default:
              return param.default ?? "";
          }
        };

  return Object.fromEntries(
    Object.entries(params).map(([paramName, param]) => {
      return [
        paramName,
        {
          ...param,
          functionName: funcName,
          param: paramName,
          value: getDefault(param),
        },
      ];
    }),
  );
};
