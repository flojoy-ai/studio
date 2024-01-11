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
import { cn } from "@src/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "src/types/auth";
type CreateUserProfileProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
};
export function CreateUserProfile({
  open,
  handleOpenChange,
}: CreateUserProfileProps) {
  const [hidePass, setHidePass] = useState(true);
  const [data, setData] = useState<User>({
    name: "",
    password: "",
    role: "Moderator",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const handleInputChange =
    (key: keyof typeof data, value?: string) =>
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMsg("");
      setData((prev) => ({ ...prev, [key]: value ? value : e?.target.value }));
    };
  const isStrongPassword = (password: string) => {
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    if (data.password) {
      if (!isStrongPassword(data.password)) {
        setErrorMsg(
          "Password should be 8 characters long and contain at least one number!",
        );
        return;
      }
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
                "border-red-400": errorMsg,
              })}
              id="profile_user_name"
              placeholder="Enter a user name"
              type="text"
              value={data.name}
              onChange={handleInputChange("name")}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit" htmlFor="profile_user_password">
              Password (optional)
            </Label>
            <div className="relative w-full">
              <Input
                className={cn({
                  "border-red-400": errorMsg,
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
                <SelectItem value="Moderator">Moderator</SelectItem>
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
