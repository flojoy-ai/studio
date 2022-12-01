import { CustomNodeProps } from "../types/CustomNodeProps";

export const NodeStyle = (
  data: CustomNodeProps["data"],
  theme: "light" | "dark"
): React.CSSProperties | undefined => {
  if (data.func === "LINSPACE") {
    return {
      padding: 10,
      height: "105px",
      width: "192px",
      fontWeight: 600,
      borderRadius: "6px",
      backgroundColor:
        theme === "light" ? "rgb(123 97 255 / 16%)" : "#99f5ff4f",
      border:
        theme === "light"
          ? "1px solid rgba(123, 97, 255, 1)"
          : "1px solid #99F5FF",
      color: theme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
    };
  } else if (
    data.func === "SINE" ||
    data.func === "RAND" ||
    data.func === "CONSTANT"
  ) {
    return {
      height: "115px",
      width: "115px",
      borderRadius: "6px",
      border:
        theme === "light"
          ? "1px solid #2E83FF"
          : "1px solid rgba(123, 97, 255, 1)",
      backgroundColor:
        theme === "light" ? "rgba(46, 131, 255, 0.2)" : "rgb(123 97 255 / 16%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
      color: theme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
    };
  } else {
    return {
      display: "flex",
      alignItems: "center",
      fontSize: "17px",
      color: theme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
      background: 'transparent'
    };
  }
};