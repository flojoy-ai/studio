import { useAuth } from "@src/context/auth.context";
import ProfileBox from "@src/components/auth/ProfileBox";

import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUserProfile } from "@/renderer/components/common/CreateProfileModal";
import { Roles } from "@/types/auth";
type AuthPageProps = {
  startup: boolean;
};
const AuthPage = ({ startup }: AuthPageProps) => {
  const { user, users, setUser } = useAuth();
  const [openCreateProfile, setOpenCreateProfile] = useState(false);
  const navigate = useNavigate();
  const validateUser = async () => {
    if (!user) return;
    if (!user.password && startup) {
      navigate("/flowchart");
      window.api.setUserProfile(user.name);
    }
  };
  useEffect(() => {
    validateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex min-w-[400px] max-w-5xl flex-col items-center gap-4 rounded-md border bg-background p-6">
        <div className="flex flex-col items-center justify-center gap-1 pb-3">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="h-12 w-12 rounded-full"
          />
          <h3 className="text-2xl">Who's using Studio ?</h3>
          <h6 className="px-5 text-sm">
            With profiles you can control over all of your studio stuff like who
            can edit block scripts, apps etc
          </h6>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pb-5">
          {!!users.length &&
            users.map((u) => (
              <ProfileBox
                key={u.name}
                user={u}
                setUser={setUser}
                currentUser={user ?? users[0]}
                showPassOption={
                  !startup ? u.name !== user?.name : u.name === user?.name
                }
                startup={startup}
              />
            ))}
          {user?.role === Roles.admin && !startup && (
            <div
              onClick={() => setOpenCreateProfile(true)}
              title="Add new profile"
              className="flex h-56 w-52 cursor-pointer items-center justify-center gap-4 rounded-md border p-5 hover:bg-muted"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted p-2">
                <PlusIcon />
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateUserProfile
        open={openCreateProfile}
        handleOpenChange={setOpenCreateProfile}
      />
    </div>
  );
};

export default AuthPage;
