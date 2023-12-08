import Store from "electron-store";

const schema = {
  poetryOptionalGroups: {
    type: "array",
    default: [],
    items: {
      type: "string",
    },
  },
} as const;

export const store = new Store({ schema });
