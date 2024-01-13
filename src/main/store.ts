import Store from "electron-store";
import os from "os";
import { Roles, User } from "../types/auth";

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
        role: Roles.admin,
        logged: true,
      },
    ],
  },
  // schema: {
  //   poetryOptionalGroups: {
  //     type: "array",
  //     default: [],
  //     items: {
  //       type: "string",
  //     },
  //   },
  // },
});
