import Store from "electron-store";

type TypedStore = {
  poetryOptionalGroups: string[];
  setupStarted: number;
};

export const store = new Store<TypedStore>({
  defaults: {
    poetryOptionalGroups: [],
    setupStarted: 0,
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
