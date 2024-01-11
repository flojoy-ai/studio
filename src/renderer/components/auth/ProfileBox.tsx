import React from "react";
import { User } from "src/types/auth";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@src/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getAlphabetAvatar } from "@src/utils/TextWrap";
import { useNavigate } from "react-router-dom";
type ProfileBoxProps = {
  user: User;
  setUser: (user: User) => void;
};
const ProfileBox = ({ user, setUser }: ProfileBoxProps) => {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passRequired, setPassRequired] = React.useState(false);
  const navigate = useNavigate();

  const handleBoxClick = () => {
    if (user.password) {
      setPassRequired(true);
      return;
    }
    window.api.setUserProfile(user.name);
    setUser(user);
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
      navigate("/flowchart");
    }
  };

  return (
    <div
      onClick={handleBoxClick}
      className="flex w-52 cursor-pointer flex-col items-center gap-4 rounded-md border p-5 hover:bg-muted"
    >
      <p className="text-md">{user.role}</p>
      <Avatar className="h-24 w-24 text-2xl">
        <AvatarFallback>{getAlphabetAvatar(user?.name ?? "")}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "h-0 w-full flex-col gap-4 opacity-0 transition-all duration-300 ease-in",
          {
            "flex h-auto opacity-100": passRequired,
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
  );
};

export default ProfileBox;
