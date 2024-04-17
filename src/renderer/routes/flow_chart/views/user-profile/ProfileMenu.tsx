import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import { KeyIcon, UserPlus2 } from "lucide-react";
import { Fragment, useState } from "react";
import { PasswordModal } from "./PasswordModal";
import { CreateUserProfile } from "@/renderer/components/common/CreateProfileModal";
import { useAuth } from "@/renderer/context/auth.context";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/renderer/components/ui/badge";

const ProfileMenu = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleSwitchUser = () => {
    navigate(`/auth/user-switch`);
  };
  if (!user) return null;
  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-2">
          {user.name.slice(0, 10)}
          {user.role === "Admin" ? (
            <Badge> Admin </Badge>
          ) : (
            <Badge> Operator </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2">
          <DropdownMenuLabel>{user.role}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "Admin" && (
            <>
              <DropdownMenuItem onClick={() => setOpenPasswordModal(true)}>
                <KeyIcon size={14} className="mr-2" />{" "}
                {user.password ? "Change password" : "Set a password"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {user.role === "Admin" && (
            <DropdownMenuItem onClick={() => setOpenCreateModal(true)}>
              <UserPlus2 size={14} className="mr-2" /> Create new profile
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => handleSwitchUser()}>
            Switch user profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openPasswordModal && (
        <PasswordModal
          open={openPasswordModal}
          handleOpenChange={(open) => setOpenPasswordModal(open)}
          user={user}
          setUser={(user) => setUser(user)}
        />
      )}
      {openCreateModal && (
        <CreateUserProfile
          open={openCreateModal}
          handleOpenChange={(open) => setOpenCreateModal(open)}
        />
      )}
    </Fragment>
  );
};

export default ProfileMenu;
