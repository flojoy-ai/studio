import { useMantineTheme } from "@mantine/core";

type SyntaxTheme = {
  [key: string]: {
    display?: string;
    overflowX?: string;
    padding?: string;
    color?: string;
    background?: string;
    fontStyle?: string;
    fontWeight?: string;
  };
};

export const useFlojoySyntaxTheme = () => {
  const theme = useMantineTheme();
  const darkFlojoy: SyntaxTheme = {
    hljs: {
      display: "block",
      overflowX: "auto",
      padding: "0.5em",
      color: theme.colors.title[0],
      background: theme.colors.modal[0],
    },
    "hljs-comment": {
      color: `${theme.colors.text[0]}`,
      fontStyle: "italic",
    },
    "hljs-quote": {
      color: `${theme.colors.text[0]}`,
      fontStyle: "italic",
    },
    "hljs-keyword": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-selector-tag": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-literal": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-subst": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-number": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-string": {
      color: `${theme.colors.accent3[0]}`,
    },
    "hljs-doctag": {
      color: `${theme.colors.text[0]}`,
    },
    "hljs-selector-id": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-selector-class": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-section": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-type": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-params": {
      color: `${theme.colors.accent2[0]}`,
    },
    "hljs-title": {
      color: `${theme.colors.accent3[0]}`,
    },
    "hljs-tag": {
      color: "#000080",
      fontWeight: "normal",
    },
    "hljs-name": {
      color: "#000080",
      fontWeight: "normal",
    },
    "hljs-attribute": {
      color: "#000080",
      fontWeight: "normal",
    },
    "hljs-variable": {
      color: "#008080",
    },
    "hljs-template-variable": {
      color: "#008080",
    },
    "hljs-regexp": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-link": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-symbol": {
      color: "#990073",
    },
    "hljs-bullet": {
      color: "#990073",
    },
    "hljs-built_in": {
      color: `${theme.colors.accent2[0]}`,
    },
    "hljs-builtin-name": {
      color: `${theme.colors.accent2[0]}`,
    },
    "hljs-meta": {
      color: "#999",
      fontWeight: "bold",
    },
    "hljs-deletion": {
      background: "#fdd",
    },
    "hljs-addition": {
      background: "#dfd",
    },
    "hljs-emphasis": {
      fontStyle: "normal",
    },
    "hljs-strong": {
      fontWeight: "bold",
    },
  };

  const lightFlojoy: SyntaxTheme = {
    hljs: {
      display: "block",
      overflowX: "auto",
      padding: "0.5em",
      color: theme.colors.title[0],
      background: theme.colors.modal[0],
    },
    "hljs-comment": {
      color: `${theme.colors.text[0]}`,
      fontStyle: "italic",
    },
    "hljs-quote": {
      color: `${theme.colors.text[0]}`,
      fontStyle: "italic",
    },
    "hljs-keyword": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-selector-tag": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-literal": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-subst": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-number": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-string": {
      color: `${theme.colors.accent3[0]}`,
    },
    "hljs-doctag": {
      color: `${theme.colors.accent3[0]}`,
    },
    "hljs-selector-id": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-selector-class": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-section": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-type": {
      color: `${theme.colors.accent1[1]}`,
    },
    "hljs-params": {
      color: `${theme.colors.accent2[0]}`,
    },
    "hljs-title": {
      color: `${theme.colors.accent3[0]}`,
    },
    "hljs-tag": {
      color: "#000080",
      fontWeight: "normal",
    },
    "hljs-name": {
      color: "#000080",
      fontWeight: "normal",
    },
    "hljs-attribute": {
      color: "#000080",
      fontWeight: "normal",
    },
    "hljs-variable": {
      color: "#008080",
    },
    "hljs-template-variable": {
      color: "#008080",
    },
    "hljs-regexp": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-link": {
      color: `${theme.colors.accent1[0]}`,
    },
    "hljs-symbol": {
      color: "#990073",
    },
    "hljs-bullet": {
      color: "#990073",
    },
    "hljs-built_in": {
      color: `${theme.colors.accent2[0]}`,
    },
    "hljs-builtin-name": {
      color: `${theme.colors.accent2[0]}`,
    },
    "hljs-meta": {
      color: "#999",
      fontWeight: "bold",
    },
    "hljs-deletion": {
      background: "#fdd",
    },
    "hljs-addition": {
      background: "#dfd",
    },
    "hljs-emphasis": {
      fontStyle: "normal",
    },
    "hljs-strong": {
      fontWeight: "bold",
    },
  };
  return { darkFlojoy, lightFlojoy };
};
