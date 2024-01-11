import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@src/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "src/types/auth";
type PasswordModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  user: User;
  setUser: (user: User) => void;
};
export function PasswordModal({
  open,
  handleOpenChange,
  user,
  setUser,
}: PasswordModalProps) {
  const [hidePass, setHidePass] = useState(true);
  const [data, setData] = useState({ password: "", reTypedPass: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const handleInputChange =
    (key: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMsg("");
      setData((prev) => ({ ...prev, [key]: e.target.value }));
    };
  const isStrongPassword = (password: string) => {
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    if (data.password === "") return;
    if (!isStrongPassword(data.password)) {
      setErrorMsg(
        "Password should be 8 characters long and contain at least one number!",
      );
      return;
    }
    if (data.password !== data.reTypedPass) {
      setErrorMsg("Password didn't match!");
      return;
    }
    try {
      await window.api.setUserProfilePassword(user.name, data.password);
      toast.message("Password set successfully!");
      const users = await window.api.getUserProfiles();
      setUser(users.find((u) => u.name === user.name) ?? user);
      handleOpenChange(false);
    } catch (error) {
      toast.error("Failed to set password, reason: " + String(error));
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new password</DialogTitle>
          <DialogDescription>
            Password will be used to authenticate current profile
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="password">
              New password
            </Label>
            <div className="relative w-full">
              <Input
                className={cn({
                  "border-red-400": errorMsg,
                })}
                type={hidePass ? "password" : "text"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleInputChange("password")}
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
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="re_typed_password">
              Re-type password
            </Label>
            <Input
              className={cn({
                "border-red-400": errorMsg,
              })}
              id="re_typed_password"
              placeholder="Re type your password"
              type="password"
              value={data.reTypedPass}
              onChange={handleInputChange("reTypedPass")}
            />
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
