import { Anchor, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => {
  return {
    reqBtn: {
      border: `2px solid ${theme.colors.accent1[0]}`,
      background: "transparent",
      borderRadius: "2px",
      marginTop: 20,
    },
    span: {
      color: theme.colors.accent1[0],
    },
  };
});

export const RequestNode = () => {
  const { classes } = useStyles();

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <button className={classes.reqBtn}>
        <Anchor
          style={{
            textDecoration: "none",
          }}
          href="https://toqo276pj36.typeform.com/to/F5rSHVu1"
          target="_blank"
        >
          <span className={classes.span}>Request a Node</span>
        </Anchor>
      </button>
    </div>
  );
};
