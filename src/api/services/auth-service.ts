import { Roles, User } from "@root/types/auth";
import { store } from "@root/main/store";
import log from "electron-log/main";

export const authenticateUser = (
  username: string,
  password: string,
  role: User["role"],
) => {
  const users = store.get("users");
  const user = users.find(
    (u) => u.name === username && u.password === password && u.role === role,
  );
  if (user) {
    return true;
  }
  return false;
};

export const getUsers = () => {
  return store.get("users").map((u) => ({
    name: u.name,
    role: u.role,
    password: u.password ? "password" : undefined,
    logged: Boolean(u.logged),
  }));
};

export const setUserProfile = (_, username: string) => {
  const users = store.get("users");
  const filteredUsers = users.map((u) => {
    if (u.name === username) {
      u.logged = true;
    } else {
      u.logged = false;
    }
    return u;
  });
  try {
    store.set("users", filteredUsers);
  } catch (error) {
    log.error("error setting users", error);
  }
};

export const setUserProfilePassword = (
  _,
  username: string,
  password: string,
): Promise<void> => {
  const users = store.get("users");
  const modifiedUsers = users.map((u) => {
    if (u.name === username) {
      u.password = password;
    }
    return u;
  });
  return new Promise((resolve, reject) => {
    try {
      store.set("users", modifiedUsers);
      resolve(void 0);
    } catch (error) {
      reject(String(error));
    }
  });
};

export const validatePassword = (_, username: string, password: string) => {
  const users = store.get("users");
  const user = users.find(
    (u) => u.name === username && u.password === password,
  );
  if (user) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const createUserProfile = (_, user: User) => {
  const users = store.get("users");
  users.push(user);
  try {
    store.set("users", users);
  } catch (error) {
    log.error("error setting users", error);
  }
};

export const deleteUserProfile = (_, username: string, currentUser: User) => {
  const users = store.get("users");
  if (currentUser.role !== Roles.admin) {
    throw new Error("Only admin can delete users!");
  }
  const modifiedUsers = users.filter((u) => u.name !== username);
  try {
    store.set("users", modifiedUsers);
    Promise.resolve(void 0);
  } catch (error) {
    log.error("error setting users", error);
  }
};