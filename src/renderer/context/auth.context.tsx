import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "src/types/auth";

type States = {
  user: User | null;
  setUser: (user: User) => void;
  users: User[];
  refreshUsers: () => void;
};

export const AuthContext = createContext<States>({
  refreshUsers: () => {},
  user: null,
  users: [],
  setUser: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const authenticateUser = useCallback(() => {
    const loggedUser = users.find((u) => u.logged);
    setUser(loggedUser ?? users[0]);
  }, [users]);

  const refreshUsers = useCallback(async () => {
    const users = await window.api.getUserProfiles();
    setUsers(users);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser, users]);
  const values = useMemo(
    () => ({
      user,
      users,
      refreshUsers,
      setUser,
    }),
    [user, users, refreshUsers],
  );
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return ctx;
};
