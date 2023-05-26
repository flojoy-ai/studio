import { createStyles, Input } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useSettings } from "@src/hooks/useSettings";

const useStyles = createStyles((theme) => ({
  content: {
    borderRadius: "8px",
    height: "85vh",
    width: "max(400px,936px)",
    position: "relative",
    inset: 0,
    padding: 0,
  },
  overlay: {
    zIndex: 100,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
    top: 15,
    right: 10,
    padding: 0,
    color: theme.colors.accent1[0],
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 43,
    height: "100%",
    width: "100%",
    padding: 24,
    backgroundColor: theme.colors.modal[0],
  },
  column: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 10,
  },
  platformName: {
    color: "#3d7ff2",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing.md, // 24px
    gap: theme.spacing.xs, // 8px
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)",
    borderRadius: theme.radius.md, // 8px
    backgroundColor: theme.colors.modal[0],
    color: theme.colors.text[0],
    border: `1px solid ${theme.colors.modal[0]}`,
    width: "100%",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: theme.spacing.xs, // 8px
    width: "100%",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.radius.xs, // 2px
  },
  commandKey: {
    color: "#3d7ff2",
  },
}));

export const SettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { classes } = useStyles();
  const { settingsList, updateSettingList } = useSettings();
  return (
    <Modal
      data-testid="settings-modal"
      opened={isOpen}
      onClose={onClose}
      size={1030}
    >
      <div data-testid="settings_container" className={classes.container}>
        <div className={classes.list}>
          {settingsList.map((setting) => (
            <div
              key={`settings-modal-${setting.key}`}
              className={classes.listItem}
            >
              <div>{setting.title}:</div>
              {setting.type === "numerical-input" && (
                <Input
                  data-testid="settings-input"
                  placeholder="Search"
                  radius="sm"
                  type="number"
                  value={setting.value}
                  onChange={(e) =>
                    updateSettingList(setting.key, Number(e.target.value))
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
