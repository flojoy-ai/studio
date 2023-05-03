import { createStyles } from "@mantine/core";

export const useAddButtonStyle = createStyles((theme) => {
  console.log(theme);
  return {
    addButton: {
      boxSizing: "border-box",
      background: theme.colorScheme === "dark" ? "#243438" : "#F6F7F8",
      border:
        theme.colorScheme === "dark"
          ? "1px solid #94F4FC"
          : "1px solid #E1E4E7",
      cursor: "pointer",
    },
  };
});
