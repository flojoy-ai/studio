import React, { useEffect } from "react";
import { User } from "src/types/auth";

const useAuth = () => {
  const [users, setUsers] = React.useState<User[]>([]);

  const refreshUsers = async () => {
    const users = await window.api.getUserProfiles();
    setUsers(users);
  };
  useEffect(() => {
    refreshUsers();
  }, []);
  return {
    users,
    refreshUsers,
  };
};

export default useAuth;
