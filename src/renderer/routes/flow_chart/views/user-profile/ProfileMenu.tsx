import { Avatar, AvatarFallback } from "@src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { KeyIcon, UserPlus2 } from "lucide-react";
import { Fragment, useState } from "react";
import { PasswordModal } from "./PasswordModal";
import { getAlphabetAvatar } from "@src/utils/TextWrap";
import { CreateUserProfile } from "../../../../components/common/CreateProfileModal";
import { useAuth } from "@src/context/auth.context";
import { useNavigate } from "react-router-dom";

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
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              {getAlphabetAvatar(user.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.role}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "admin" && (
            <>
              <DropdownMenuItem onClick={() => setOpenPasswordModal(true)}>
                <KeyIcon size={14} className="mr-2" />{" "}
                {user.password ? "Change password" : "Set a password"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {user.role === "admin" && (
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
