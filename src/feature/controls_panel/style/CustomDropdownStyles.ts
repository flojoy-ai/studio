import { lightTheme, darkTheme } from "../../common/theme";

const customDropdownStyles = {
  menu: (provided, state) => ({
    ...provided,
    zIndex: 2,
    opacity: 1,
    backgroundColor:
      state.selectProps.theme === "dark"
        ? darkTheme.colors!.dark![6]
        : lightTheme.colors!.gray![1],
  }),

  control: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    border: 0,
    outline: 0,
    backgroundColor:
      state.selectProps.theme === "dark"
        ? darkTheme.colors!.dark![6]
        : lightTheme.colors!.gray![1],
  }),

  option: (styles, { selectProps, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: "pointer",
      backgroundColor: isSelected
        ? selectProps.theme === "dark"
          ? "black"
          : "#ccc"
        : isFocused
        ? selectProps.theme === "dark"
          ? "black"
          : "#ccc"
        : undefined,
      ":active": {
        ...styles[":active"],
      },
    };
  },

  singleValue: (provided, state) => {
    const color =
      state.selectProps.theme === "dark"
        ? darkTheme.colors!.text![0]
        : lightTheme.colors!.text![0];

    return { ...provided, color };
  },
};

export default customDropdownStyles;
