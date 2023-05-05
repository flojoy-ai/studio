import { Title, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  logo: {
    fontFamily: "PonyMaker",
    fontWeight: "normal",
    fontStyle: "normal",
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
