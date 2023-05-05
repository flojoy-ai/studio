import { createStyles } from "@mantine/core";

export const useSidebarStyles = createStyles((theme) => ({
  navbarView: {
    paddingBottom: 0,
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor:
      theme.colorScheme === "dark" ? "#243438" : theme.colorScheme,
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
    transition: "500ms",
    zIndex: 1,
  },

  navbarHidden: {
    paddingBottom: 0,
    position: "absolute",
    left: "-100%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor:
      theme.colorScheme === "dark" ? "#243438" : theme.colorScheme,
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
    transition: "300ms",
    zIndex: 1,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  sections: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  sectionsInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "10px 20px 10px 20px",
    backgroundColor: theme.colorScheme === "dark" ? "#94F4FC" : "#E1E4E7",
  },

  subSection: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  buttonDark: {
    outline: "0",
    border: "1px solid rgba(153, 245, 255, 1)",
    backgroundColor: "rgba(153, 245, 255, 0.2)",
    color: "rgba(153, 245, 255, 1)",
    padding: "8px 12px 8px 12px",
    cursor: "pointer",
    margin: "5px 5px",
  },
  buttonLight: {
    outline: 0,
    border: "1px solid rgba(123, 97, 255, 1)",
    backgroundColor: "rgba(123, 97, 255, 0.17)",
    color: "rgba(123, 97, 255, 1)",
    padding: "8px 12px 8px 12px",
    cursor: "pointer",
    margin: "5px 5px",
  },
}));
