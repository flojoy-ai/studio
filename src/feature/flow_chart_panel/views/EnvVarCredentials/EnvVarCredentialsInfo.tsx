import { useState } from "react";
import { IconDotsVertical, IconEye, IconEyeOff } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@src/components/ui/select";
import { Button } from "@src/components/ui/button";
import { ScrollArea, ScrollBar } from "@src/components/ui/scroll-area";
import EnvVarEdit from "./EnvVarEdit";
import AlertRemove from "./EnvVarRemove";
export interface EnvVarCredentialsInfoProps {
  credentialKey: string;
  credentialValue: string;
}

const EnvVarCredentialsInfo = ({
  credentialKey,
  credentialValue,
}: EnvVarCredentialsInfoProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div
      key={credentialKey}
      className="overflow-x-none mb-3 ml-0.5 flex w-full rounded-md border border-solid border-gray-600"
    >
      <p className="my-2.5 ml-5 flex w-52 text-base font-semibold text-black dark:text-white">
        {credentialKey}
      </p>
      <div className="ml-36 mt-2.5 flex">
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <IconEyeOff
              className="-mt-3 mr-4 stroke-gray-600"
              size={19}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <IconEye
              className="-mt-3 mr-4 stroke-gray-600"
              size={19}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </button>
        <p className="mr-1 overflow-hidden text-base font-semibold text-gray-600">
          <ScrollArea className="w-[101px]">
            {showPassword ? credentialValue : "*".repeat(15)}
            <ScrollBar className="h-[7px]" orientation="horizontal"></ScrollBar>
          </ScrollArea>
        </p>
        <Select>
          <SelectTrigger className="mr-4 mt-0.5 h-5 w-0 border-transparent p-0 focus:ring-transparent">
            <Button variant={"ghost"} size={"icon"}>
              <IconDotsVertical className="stroke-gray-600 " size={20} />
            </Button>
          </SelectTrigger>
          <SelectContent>
            <AlertRemove />
            <EnvVarEdit credentialKey={credentialKey} />
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnvVarCredentialsInfo;
