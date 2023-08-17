import { CSSProperties } from "react";

type SyntaxTheme = {
  [key: string]: CSSProperties;
};

export const flojoySyntaxTheme: SyntaxTheme = {
  hljs: {
    display: "block",
    padding: "20px",
    overflowX: "auto",
    color: "rgb(var(--foreground))",
    background: "rgb(var(--color-modal))",
  },
  "hljs-comment": {
    color: "rgb(var(--foreground))",
    fontStyle: "italic",
  },
  "hljs-quote": {
    color: "rgb(var(--foreground))",
    fontStyle: "italic",
  },
  "hljs-keyword": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-selector-tag": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-literal": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-subst": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-number": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-string": {
    color: "rgb(var(--color-accent3))",
  },
  "hljs-doctag": {
    color: "rgb(var(--foreground))",
  },
  "hljs-selector-id": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-selector-class": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-section": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-type": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-params": {
    color: "rgb(var(--color-accent2))",
  },
  "hljs-title": {
    color: "rgb(var(--color-accent3))",
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
    color: "rgb(var(--color-accent1))",
  },
  "hljs-link": {
    color: "rgb(var(--color-accent1))",
  },
  "hljs-symbol": {
    color: "#990073",
  },
  "hljs-bullet": {
    color: "#990073",
  },
  "hljs-built_in": {
    color: "rgb(var(--color-accent2))",
  },
  "hljs-builtin-name": {
    color: "rgb(var(--color-accent2))",
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
