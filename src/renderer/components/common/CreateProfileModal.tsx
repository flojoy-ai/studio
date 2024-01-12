import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { useAuth } from "@src/context/auth.context";
import { cn } from "@src/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Roles, User } from "../../../types/auth";
type CreateUserProfileProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
};
export function CreateUserProfile({
  open,
  handleOpenChange,
}: CreateUserProfileProps) {
  const { users, refreshUsers } = useAuth();
  const [hidePass, setHidePass] = useState(true);
  const [data, setData] = useState<User>({
    name: "",
    password: "",
    role: Roles.codeOnly,
  });
  const [errorMsg, setErrorMsg] = useState({
    name: "",
    password: "",
  } as const);
  const handleInputChange =
    (key: keyof typeof data, value?: string) =>
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMsg({ name: "", password: "" });
      setData((prev) => ({ ...prev, [key]: value ? value : e?.target.value }));
    };

  const updateErrorMsg = (key: keyof typeof errorMsg, value: string) => {
    setErrorMsg((prev) => ({ ...prev, [key]: value }));
  };
  const isStrongPassword = (password: string) => {
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    if (data.password) {
      if (!isStrongPassword(data.password)) {
        updateErrorMsg(
          "password",
          "Password should be 8 characters long and contain at least one number!",
        );
        return;
      }
    }
    if (!data.name) {
      updateErrorMsg("name", "User name is required!");
      return;
    }
    if (!data.role) return;
    const nameExists = users.find((u) => u.name === data.name);
    if (nameExists) {
      updateErrorMsg("name", "User name already exists!");
      return;
    }
    try {
      await window.api.createUserProfile(data);
      toast.message("User profile created successfully!");
      refreshUsers();
      handleOpenChange(false);
    } catch (error) {
      toast.error("Failed to create user profile, reason: " + String(error));
    }
    return;
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new user profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="profile_user_name">
              User name
            </Label>
            <Input
              className={cn({
                "border-red-400": errorMsg["name"],
              })}
              id="profile_user_name"
              placeholder="Enter a user name"
              type="text"
              value={data.name}
              onChange={handleInputChange("name")}
            />
            {errorMsg["name"] && (
              <p className="text-sm text-red-400">{errorMsg["name"]}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="profile_user_password">
              Password (optional)
            </Label>
            <div className="relative w-full">
              <Input
                className={cn({
                  "border-red-400": errorMsg["password"],
                })}
                type={hidePass ? "password" : "text"}
                id="profile_user_password"
                name="password"
                value={data.password}
                onChange={handleInputChange("password")}
                placeholder="Enter a password"
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
            {errorMsg["password"] && (
              <p className="text-sm text-red-400">{errorMsg["password"]}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="re_typed_password">
              Role
            </Label>

            <Select onValueChange={(v) => handleInputChange("role", v)}>
              <SelectTrigger>
                <SelectValue
                  placeholder="Select role"
                  defaultValue={data.role}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Roles).map((role) => (
                  <SelectItem value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
