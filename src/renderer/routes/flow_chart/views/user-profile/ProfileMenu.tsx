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
import { Fragment, useEffect, useState } from "react";
import { PasswordModal } from "./PasswordModal";
import { useSocket } from "@src/hooks/useSocket";
import { getAlphabetAvatar } from "@src/utils/TextWrap";
import { CreateUserProfile } from "./CreateProfileModal";
import { User } from "src/types/auth";

const ProfileMenu = () => {
  const {
    states: { user, setUser },
  } = useSocket();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    const users = await window.api.getUserProfiles();
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  if (!user) return null;
  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              {getAlphabetAvatar(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!user?.password && (
            <DropdownMenuItem onClick={() => setOpenPasswordModal(true)}>
              <KeyIcon size={14} className="mr-2" /> Set a password
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenCreateModal(true)}>
            <UserPlus2 size={14} className="mr-2" /> Create new profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Other profiles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!!users.length &&
            users
              .filter((u) => u.name !== user?.name)
              .map((u) => (
                <DropdownMenuItem key={u.name}>
                  <Avatar className="mr-2">
                    <AvatarFallback>{getAlphabetAvatar(u.name)}</AvatarFallback>
                  </Avatar>
                  {u.name}
                </DropdownMenuItem>
              ))}
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
