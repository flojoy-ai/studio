import React from "react";
import { User } from "@/types/auth";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/renderer/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getAlphabetAvatar } from "@/renderer/utils/TextWrap";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import ConfirmPrompt from "../common/ConfirmPrompt";
import { toast } from "sonner";
import { parseElectronError } from "@/renderer/utils/parse-error";
import { useAuth } from "@/renderer/context/auth.context";
import { baseClient } from "@/renderer/lib/base-client";

type ProfileBoxProps = {
  user: User;
  setUser: (user: User) => void;
  currentUser: User;
  showPassOption: boolean;
  startup: boolean;
};
const ProfileBox = ({
  user,
  setUser,
  currentUser,
  showPassOption,
  startup,
}: ProfileBoxProps) => {
  const { refreshUsers } = useAuth();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passRequired, setPassRequired] = React.useState(false);
  const [openConfirmPrompt, setOpenConfirmPrompt] = React.useState(false);
  const navigate = useNavigate();

  const handleBoxClick = () => {
    if ((startup && user.password) || (user.password && showPassOption)) {
      setPassRequired(true);
      return;
    }
    window.api.setUserProfile(user.name);
    setUser(user);
    baseClient.post("/auth/login", { username: user.name, password });
    navigate("/flowchart");
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && passRequired) {
      if (password === "") return;
      const passMatched = await window.api.validatePassword(
        user.name,
        password,
      );
      if (!passMatched) {
        setErrorMsg("Wrong password");
        return;
      }
      window.api.setUserProfile(user.name);
      setUser(user);
      setPassRequired(false);
      baseClient.post("/auth/login", { username: user.name, password });
      navigate("/flowchart");
    }
  };
  const handleDeleteProfile = async () => {
    try {
      await window.api.deleteUserProfile(user.name, currentUser);
      toast.message("Profile deleted successfully!");
      refreshUsers();
      setOpenConfirmPrompt(false);
    } catch (error) {
      toast.error(
        "Failed to delete profile " + parseElectronError(String(error)),
      );
    }
  };
  return (
    <>
      <div
        onClick={handleBoxClick}
        className={cn(
          "flex w-52 cursor-pointer flex-col items-center gap-4 rounded-md border p-5 hover:bg-muted",
          { "border-accent1": currentUser.name === user.name },
        )}
      >
        <div className="relative flex w-full items-center justify-center">
          <p className="text-md">{user.role}</p>
          {currentUser.role === "Admin" &&
            user.name !== currentUser.name &&
            !startup && (
              <div className="absolute right-1 top-2 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="pointer-events-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenConfirmPrompt(true);
                    }}
                  >
                    <DropdownMenuItem>Delete profile</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
        </div>
        <Avatar className="h-24 w-24 text-2xl">
          <AvatarFallback>{getAlphabetAvatar(user.name)}</AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "h-0 w-full flex-col gap-4 opacity-0 transition-all duration-300 ease-in",
            {
              "flex h-auto opacity-100":
                passRequired || (startup && showPassOption),
            },
          )}
        >
          <div className="flex flex-col items-start gap-2">
            <Label className="min-w-fit text-sm" htmlFor="password">
              Enter password and hit enter
            </Label>
            <div className="relative w-full">
              <Input
                className={cn({
                  "border-red-400": errorMsg,
                })}
                type={"password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setErrorMsg("");
                  setPassword(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
              />
            </div>
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          </div>
        </div>

        <p className="text-sm">{user.name}</p>
      </div>
      <ConfirmPrompt
        open={openConfirmPrompt}
        confirmBtnText="Delete"
        description="This action is irreversible. Are you sure you want to delete this profile?"
        handleOpenChange={setOpenConfirmPrompt}
        handleConfirm={handleDeleteProfile}
      />
    </>
  );
};

export default ProfileBox;
