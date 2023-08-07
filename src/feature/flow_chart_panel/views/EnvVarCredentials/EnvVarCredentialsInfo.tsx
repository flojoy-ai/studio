import { useState } from "react";
import { IconDotsVertical, IconEye, IconEyeOff } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
} from "@src/components/ui/select";
import { Button } from "@src/components/ui/button";
import EnvVarEdit from "./EnvVarEdit";
import EnvVarDelete from "./EnvVarDelete";
import { EnvVarCredentialType } from "@src/hooks/useFlowChartState";
export interface EnvVarCredentialsInfoProps {
  credential: EnvVarCredentialType;
  fetchCredentials: () => void;
}

const EnvVarCredentialsInfo = ({
  credential,
  fetchCredentials,
}: EnvVarCredentialsInfoProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const PasswordIcon = showPassword ? IconEyeOff : IconEye;

  return (
    <div
      data-testid="credentialName"
      key={credential.id}
      className="mb-3 ml-0.5 flex w-full rounded-md border border-solid border-gray-800"
    >
      <div className="px-2.5" />
      <div className="py-2.5 font-semibold text-gray-800 dark:text-gray-200">
        {credential.key}
      </div>
      <div className="ml-auto mr-4 flex items-center">
        <button type="button" onClick={toggleShowPassword}>
          <PasswordIcon
            data-testid="passWordIconView"
            className="stroke-gray-600"
            size={20}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </button>
        <div className="px-2" />
        <div className="mr-2 flex w-24 items-center font-semibold text-gray-600">
          {showPassword ? (
            <span className="inline-block w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold">
              {credential.value}
            </span>
          ) : (
            "•".repeat(15)
          )}
        </div>
        <Select>
          <SelectTrigger className="mr-2 mt-0.5 h-5 w-0 border-transparent p-0 focus:ring-transparent">
            <Button data-testid="envVarModifyBtn" variant={"ghost"} size={"icon"}>
              <IconDotsVertical className="stroke-gray-600 " size={20} />
            </Button>
          </SelectTrigger>
          <SelectContent>
            <EnvVarDelete credential={credential} />
            <EnvVarEdit
              credentialKey={credential.key}
              fetchCredentials={fetchCredentials}
            />
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnvVarCredentialsInfo;
