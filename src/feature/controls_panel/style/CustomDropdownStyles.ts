import { lightTheme, darkTheme } from "../../common/theme";
import { DEFAULT_THEME } from "@mantine/core";

// This should be refactored into a mantine createStyles with
// a mantine select component anyway... temp fix to appease ESLint.

const darkThemeDark = darkTheme.colors?.dark ?? DEFAULT_THEME.colors.dark;
const lightThemeGray = lightTheme.colors?.gray ?? DEFAULT_THEME.colors.gray;
const darkThemeText = darkTheme.colors?.text ?? DEFAULT_THEME.colors.text;
const lightThemeText = lightTheme.colors?.text ?? DEFAULT_THEME.colors.text;

const customDropdownStyles = {
  menu: (provided, state) => ({
    ...provided,
    zIndex: 2,
    opacity: 1,
    backgroundColor:
      state.selectProps.theme === "dark" ? darkThemeDark[6] : lightThemeGray[1],
  }),

  control: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    border: 0,
    outline: 0,
    backgroundColor:
      state.selectProps.theme === "dark" ? darkThemeDark[6] : lightThemeGray[1],
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
      state.selectProps.theme === "dark" ? darkThemeText[0] : lightThemeText[0];

    return { ...provided, color };
  },
};

export default customDropdownStyles;
