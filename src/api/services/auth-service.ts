import { store } from "../../main/store";
import log from "electron-log/main";

export const authenticateUser = (
  username: string,
  password: string,
  role: "Admin" | "Moderator",
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
  const userLoggedIndex = users.findIndex(
    (u) => u.name === username && u.logged,
  );
  if (userLoggedIndex !== -1) {
    users[userLoggedIndex].logged = false;
  }
  const index = users.findIndex((u) => u.name === username);
  if (index !== -1) {
    users[index].logged = true;
  }
  try {
    store.set("users", users);
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
  const index = users.findIndex((u) => u.name === username);
  if (index !== -1) {
    users[index].password = password;
  }
  return new Promise((resolve, reject) => {
    try {
      store.set("users", users);
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
