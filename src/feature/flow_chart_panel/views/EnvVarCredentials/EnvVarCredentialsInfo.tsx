import { useState } from "react";
import { IconDotsVertical, IconEye, IconEyeOff } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
} from "@src/components/ui/select";
import { Button } from "@src/components/ui/button";
import { ScrollArea, ScrollBar } from "@src/components/ui/scroll-area";
import EnvVarEdit from "./EnvVarEdit";
import EnvVarDelete from "./EnvVarDelete";
import { EnvVarCredentialType } from "@src/hooks/useFlowChartState";
export interface EnvVarCredentialsInfoProps {
  credential: EnvVarCredentialType;
}

const EnvVarCredentialsInfo = ({ credential }: EnvVarCredentialsInfoProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const PasswordIcon = showPassword ? IconEyeOff : IconEye;

  return (
    <div
      key={credential.id}
      className="mb-3 ml-0.5 flex w-full rounded-md border border-solid border-gray-800"
    >
      <p className="my-2.5 ml-5 flex text-base font-semibold text-black dark:text-white">
        {credential.key}
      </p>
      <div className="ml-auto mr-4 mt-2.5 flex">
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          <PasswordIcon
            className="-mt-3 mr-4 stroke-gray-600"
            size={19}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </button>
        <div className="mr-2 overflow-hidden text-base font-semibold text-gray-600">
          <ScrollArea className="w-24">
            {showPassword ? credential.value : "•".repeat(15)}
            <ScrollBar className="h-2" orientation="horizontal"></ScrollBar>
          </ScrollArea>
        </div>
        <Select>
          <SelectTrigger className="mr-2 mt-0.5 h-5 w-0 border-transparent p-0 focus:ring-transparent">
            <Button variant={"ghost"} size={"icon"}>
              <IconDotsVertical className="stroke-gray-600 " size={20} />
            </Button>
          </SelectTrigger>
          <SelectContent>
            <EnvVarDelete credential={credential} />
            <EnvVarEdit credentialKey={credential.key} />
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnvVarCredentialsInfo;
