import { useState } from "react";
import { MoreVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { EnvVarCredentialType } from "@src/hooks/useFlowChartState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";

export type EnvVarCredentialsInfoProps = {
  credential: EnvVarCredentialType;
  setSelectedCredential: (credential: EnvVarCredentialType) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
};

const EnvVarCredentialsInfo = ({
  credential,
  setSelectedCredential,
  setDeleteModalOpen,
  setEditModalOpen,
}: EnvVarCredentialsInfoProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const PasswordIcon = showPassword ? EyeOff : Eye;

  const handleDeleteClick = () => {
    setSelectedCredential(credential);
    setDeleteModalOpen(true);
  };

  const handleEditClick = () => {
    setSelectedCredential(credential);
    setEditModalOpen(true);
  };

  return (
    <div
      data-testid="credential-name"
      key={credential.id}
      className="mt-1 flex w-full rounded-md bg-modal py-1"
    >
      <div className="px-2.5" />
      <div className="py-2.5 font-semibold text-gray-800 dark:text-gray-200">
        {credential.key}
      </div>
      <div className="ml-auto mr-6 flex items-center gap-x-2">
        <button type="button" onClick={toggleShowPassword}>
          <PasswordIcon
            data-testid="password-icon-view"
            className="stroke-gray-600"
            size={20}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </button>
        <div className="flex w-24 items-center font-semibold text-gray-600">
          {showPassword ? (
            <span className="inline-block w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-medium">
              {credential.value}
            </span>
          ) : (
            <span className="tracking-wider">{"•".repeat(15)}</span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="env-var-modify-btn"
              variant={"ghost"}
              size={"icon"}
            >
              <MoreVertical className="stroke-gray-600" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[80px]">
            <DropdownMenuItem
              data-testid="env-var-edit-btn"
              onClick={handleEditClick}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              data-testid="env-var-delete-btn"
              onClick={handleDeleteClick}
              className="cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EnvVarCredentialsInfo;
