import { Roles, User } from "@/types/auth";
import { store } from "@/main/store";
import bcrypt from "bcryptjs";

const hashPassword = (plainPassword: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
};

const comparePassword = (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
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
    throw new Error("error setting users" + String(error));
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
      const hashedPassword = hashPassword(password);
      u.password = hashedPassword;
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
    (u) => u.name === username && comparePassword(password, u.password ?? ""),
  );
  if (user) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const createUserProfile = (_, user: User) => {
  const users = store.get("users");
  if (user.password) {
    const hashedPassword = hashPassword(user.password);
    user.password = hashedPassword;
  }
  users.push(user);
  try {
    store.set("users", users);
  } catch (error) {
    throw new Error("error setting users" + String(error));
  }
};

export const deleteUserProfile = (_, username: string, currentUser: User) => {
  const users = store.get("users");
  if (currentUser.role !== "admin") {
    throw new Error("Only admin can delete users!");
  }
  const modifiedUsers = users.filter((u) => u.name !== username);
  try {
    store.set("users", modifiedUsers);
    Promise.resolve(void 0);
  } catch (error) {
    throw new Error("error setting users" + String(error));
  }
};
