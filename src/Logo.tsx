import { Title, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  logo: {
    fontFamily: "PonyMaker",
    fontWeight: "normal",
    fontStyle: "normal",
    color: theme.colorScheme === "dark" ? "#fff" : "#000",
  },
}));

export const Logo = () => {
  const { classes } = useStyles();
  return (
    <Title size="h1" className={classes.logo} px={8} m={0}>
      FLOJOY
    </Title>
  );
};
