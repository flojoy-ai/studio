import Store from "electron-store";

type TypedStore = {
  poetryOptionalGroups: string[];
};

export const store = new Store<TypedStore>({
  defaults: {
    poetryOptionalGroups: [],
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
