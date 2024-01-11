import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { useSocket } from "@src/hooks/useSocket";
import { cn } from "@src/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const {
    states: { user },
  } = useSocket();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [hidePass, setHidePass] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const validateUser = async () => {
    if (!user) return;
    if (!user?.password) {
      navigate("/flowchart");
      window.api.setUserProfile(user.name);
    }
  };
  const handleSubmit = async () => {
    if (password === "" || !user) return;

    const passMatched = await window.api.validatePassword(user.name, password);
    if (!passMatched) {
      setErrorMsg("Wrong password");
      return;
    }
    window.api.setUserProfile(user.name);
    navigate("/flowchart");
  };
  useEffect(() => {
    validateUser();
  }, [user]);

  //   useEffect(() => {
  //     authenticate();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center rounded-md border bg-background p-5">
        <h2 className="text-2xl">
          Hi, <strong>{user?.name}</strong>!
        </h2>
        <p className="text-sm">Please enter your password to continue...</p>
        <div className="flex w-full flex-col gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="password">
              Password
            </Label>
            <div className="relative w-full">
              <Input
                className={cn({
                  "border-red-400": errorMsg,
                })}
                type={hidePass ? "password" : "text"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setErrorMsg("");
                  setPassword(e.target.value);
                }}
                placeholder="Enter your password"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-2"
                title={hidePass ? "Show password" : "Hide password"}
                onClick={() => setHidePass((p) => !p)}
              >
                {hidePass ? (
                  <EyeIcon className="cursor-pointer" />
                ) : (
                  <EyeOffIcon className="cursor-pointer" />
                )}
              </div>
            </div>
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          </div>
        </div>
        <Button onClick={handleSubmit}>Launch Studio</Button>
      </div>
    </div>
  );
};

export default Auth;
