import Store from "electron-store";
import os from "os";
import { User } from "../types/auth";

type TypedStore = {
  poetryOptionalGroups: string[];
  users: User[];
};

export const store = new Store<TypedStore>({
  defaults: {
    poetryOptionalGroups: [],
    users: [
      {
        name: os.userInfo().username,
        role: "Admin",
        logged: true,
      },
    ],
  },
});
