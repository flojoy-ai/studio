import {
  Box,
  createStyles,
  UnstyledButton,
  UnstyledButtonProps,
} from "@mantine/core";
import { memo } from "react";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: 4,
    borderRadius: 4,
    transition: "150ms ease-in-out",
    "&:hover": {
      backgroundColor: theme.colors.accent4[1],
    },
  },
}));

type IconButtonProps = {
  onClick: () => void;
  icon: JSX.Element;
  children: React.ReactNode;
} & UnstyledButtonProps;

const IconButton = ({ onClick, icon, children, ...props }: IconButtonProps) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton p={4} h="100%" onClick={onClick} {...props}>
      <div className={classes.container}>
        {icon} <div ml={4}>{children}</div>{" "}
      </div>
    </UnstyledButton>
  );
};

export default memo(IconButton);
