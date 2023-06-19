import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo, useState } from "react";
import { Modal, createStyles, Button, Input } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { sendS3KeyToDjango } from "@src/services/FlowChartServices";

interface S3KeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
  container: {
    display: "relative",
    justifyContent: "center",
    alignItems: "center",
    border: `1px solid ${theme.colors.accent5[0]}`,
    gap: 43,
    height: 400,
    backgroundColor: theme.colors.modal[1],
    borderRadius: 19,
    boxShadow:
      theme.colorScheme === "light"
        ? `0px 4px 8px 2px ${theme.colors.accent5[1]}`
        : "none",
  },
  title: {
    display: "flex",
    gap: 9.7,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "10%",
    marginLeft: "11%",
  },
  titleText: {
    position: "absolute",
    left: "19%",
    top: "8.7%",
  },
  userInputContainer: {
    display: "relative",
    marginLeft: 40,
    marginTop: 0,
  },
  submitButtonLine: {
    display: "flex",
    gap: 2,
  },
  submitBtn: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0],
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[3]
          : theme.colors.accent2[2],
    },
    marginTop: 53,
    marginLeft: -88,
    marginRight: 100,
  },
  closeBtn: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.title[0]
        : theme.colors.gray[9],
    top: 10,
    right: 15,
  },
  inputBox: {
    input: {
      width: 270,
      backgroundColor: theme.colors.modal[0],
    },
    marginTop: 5,
  },
}));
const S3KeyModal = ({ isOpen, onClose }: S3KeyModelProps) => {
  const { classes } = useStyles();
  const [s3Name, setS3Name] = useState<string>("");
  const { s3AccessKey, setS3AccessKey, s3SecretKey, setS3SecretKey } =
    useFlowChartState();

  const handlNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setS3Name(e.target.value);
  };

  const handleS3AccessKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setS3AccessKey(e.target.value);
  };

  const handleS3SecretKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setS3SecretKey(e.target.value);
  };

  const handleS3Key = () => {
    if (s3AccessKey === null || s3AccessKey.trim() === "") {
      console.error("There is no API Key");
    } else {
      notifications.show({
        id: "set-s3-key",
        loading: true,
        title: "Setting your AWS S3 key",
        message: "Setting your AWS S3 key, please be patient",
        autoClose: false,
        withCloseButton: false,
      });
      sendS3KeyToDjango(s3Name, s3AccessKey, s3SecretKey);
      setS3SecretKey("");
      setS3AccessKey("");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal.Root
        data-testid="user_S3_Key_modal"
        opened={isOpen}
        onClose={handleClose}
        aria-labelledby="S3 Key modal"
        size={350}
        centered
      >
        <Modal.Overlay />
        <Modal.Content className={classes.container}>
          <div className={classes.title}>
            <FamilyHistoryIconSvg size={20} />
            <div className={classes.titleText}>Set S3 Key</div>
          </div>
          <Modal.CloseButton className={classes.closeBtn} />
          <div className={classes.userInputContainer}>
            <h4 style={{ marginBottom: 0 }}>Name:</h4>
            <div className={classes.submitButtonLine}>
              <Input
                type="text"
                onChange={handlNameChange}
                value={s3Name}
                className={classes.inputBox}
              />
            </div>
            <h4 style={{ marginBottom: 0 }}>Access Key:</h4>
            <div className={classes.submitButtonLine}>
              <Input
                type="text"
                onChange={handleS3AccessKeyChange}
                value={s3AccessKey}
                className={classes.inputBox}
              />
            </div>
            <h4 style={{ marginBottom: 0 }}>Secret Access Key:</h4>
            <div className={classes.submitButtonLine}>
              <Input
                type="text"
                onChange={handleS3SecretKeyChange}
                value={s3SecretKey}
                className={classes.inputBox}
              />
              <Button
                disabled={!s3SecretKey}
                onClick={handleS3Key}
                className={classes.submitBtn}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal.Root>
      <Notifications />
    </>
  );
};

export default memo(S3KeyModal);
