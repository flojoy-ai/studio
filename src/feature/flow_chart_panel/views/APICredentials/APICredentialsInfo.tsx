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
      <p className="my-2.5 ml-5 flex overflow-x-hidden text-base font-semibold text-black dark:text-white">
        {credential.username}
      </p>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="ml-4"
      >
        {showPassword ? (
          <IconEyeOff
            className="-mt-1.5 flex stroke-gray-600"
            size={40}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <IconEye
            className="-mt-1.5 flex stroke-gray-600"
            size={40}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </button>
      <p className="my-2.5 ml-5 flex overflow-x-hidden text-base font-semibold text-gray-600">
        {showPassword ? credential.password : "*".repeat(15)}
      </p>
      <button type="button">
        <IconDotsVertical className="stroke-gray-600" size={20}/>
      </button>
    </div>
  );
};

export default APICredentialsInfo;
