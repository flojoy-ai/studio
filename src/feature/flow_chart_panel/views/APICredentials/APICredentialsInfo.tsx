import { useState } from "react";
import { IconDotsVertical, IconEye, IconEyeOff } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Button } from "@src/components/ui/button";
export interface APICredentialsInfoProps {
  credentialKey: string;
  credential: any;
}
const APICredentialsInfo = ({
  credentialKey,
  credential,
}: APICredentialsInfoProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div
      key={credentialKey}
      className="overflow-x-none mb-3 ml-0.5 flex w-full rounded-md border border-solid border-gray-600"
    >
      <p className="my-2.5 ml-5 flex text-base font-semibold text-black dark:text-white">
        {credential.username}
      </p>
      <div className="absolute right-4 mt-2.5 flex">
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <IconEyeOff
              className="mr-4 stroke-gray-600"
              size={19}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <IconEye
              className="mr-4 stroke-gray-600"
              size={19}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </button>
        <p className="mr-1 text-base font-semibold text-gray-600">
          <div>{showPassword ? credential.password : "*".repeat(15)}</div>
        </p>
        <Select>
          <SelectTrigger className="mr-4 mt-0.5 h-5 w-0 border-transparent p-0 focus:ring-transparent">
            <Button variant={"ghost"} size={"icon"}>
              <IconDotsVertical className="stroke-gray-600 " size={20} />
            </Button>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default APICredentialsInfo;
