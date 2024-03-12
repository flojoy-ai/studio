import { useState } from "react";
import { MoreVertical, Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { EnvVar } from "@/renderer/types/env-var";
import { getEnvironmentVariable } from "@/renderer/lib/api";
import { toastQueryError } from "@/renderer/utils/report-error";

type Props = {
  credential: EnvVar;
  setSelectedCredential: (credential: EnvVar) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
};

const EnvVarCredentialsInfo = ({
  credential,
  setSelectedCredential,
  setDeleteModalOpen,
  setEditModalOpen,
}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [credentialValue, setCredentialValue] = useState<string>(
    credential.value,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { withPermissionCheck, isAdmin } = useWithPermission();

  const toggleShowPassword = async () => {
    if (credential.value === "") {
      setIsLoading(true);
      const res = await getEnvironmentVariable(credential.key);
      res.match(
        (v) => setCredentialValue(v.value),
        (e) => toastQueryError(e, "Error fetching environment variable"),
      );
      setIsLoading(false);
    }
    setShowPassword((prev) => !prev);
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
      key={credential.key}
      className="mt-1 flex w-full rounded-md bg-modal py-1"
    >
      <div className="px-2.5" />
      <div className="py-2.5 font-semibold text-gray-800 dark:text-gray-200">
        {credential.key}
      </div>
      <div className="ml-auto mr-6 flex items-center gap-x-2">
        <button type="button" onClick={withPermissionCheck(toggleShowPassword)}>
          {isLoading ? (
            <Loader className="scale-50" />
          ) : (
            <PasswordIcon
              data-testid="password-icon-view"
              className="stroke-gray-600"
              size={20}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </button>
        <div className="flex w-24 items-center font-semibold text-gray-600">
          {showPassword ? (
            <span className="inline-block w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-medium">
              {credentialValue}
            </span>
          ) : (
            <span className="tracking-wider">{"•".repeat(15)}</span>
          )}
        </div>
        {isAdmin() && (
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
        )}
      </div>
    </div>
  );
};

export default EnvVarCredentialsInfo;
