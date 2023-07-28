import { useState } from "react";
import { IconDotsVertical, IconEye, IconEyeOff } from "@tabler/icons-react";

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
      <div className="absolute right-3 mt-2.5 flex">
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
        <button type="button">
          <IconDotsVertical className="-mt-1 stroke-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default APICredentialsInfo;
