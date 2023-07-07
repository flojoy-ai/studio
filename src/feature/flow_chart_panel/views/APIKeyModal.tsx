import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo, useState } from "react";
import { Modal, createStyles, Button, Input } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import {
  sendApiKeyToDjango,
  sendS3KeyToDjango,
} from "@src/services/FlowChartServices";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
  container: {
    display: "relative",
    paddingLeft: "3%",
    border: `1px solid ${theme.colors.accent5[0]}`,
    gap: 43,
    height: 700,
    backgroundColor: theme.colors.modal[1],
    borderRadius: 19,
    boxShadow:
      theme.colorScheme === "light"
        ? `0px 4px 8px 2px ${theme.colors.accent5[1]}`
        : "none",
  },
  title: {
    display: "flex",
    gap: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "13%",
    marginBottom: "1%",
  },
  titleText: {
    marginTop: -2.3,
  },
  userInputContainer: {
    display: "relative",
    marginLeft: 40,
    marginTop: 0,
  },
  oneSubmitButtonLine: {
    display: "flex",
    marginLeft: 5,
    gap: 4,
    color: theme.colors.accent1[0],
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
  },
  s3Container: {
    marginLeft: 0,
  },
  s3SubmitBtn: {
    marginLeft: 274,
    marginTop: 5,
  },
}));
const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { classes } = useStyles();
  const { apiKey, setApiKey } = useFlowChartState();
  const [s3Name, setS3Name] = useState<string>("");
  const { s3AccessKey, setS3AccessKey, s3SecretKey, setS3SecretKey } =
    useFlowChartState();

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  const handleClose = () => {
    setApiKey("");
    onClose();
  };

  const handleSendAPI = () => {
    notifications.show({
      id: "set-api-key",
      loading: true,
      title: "Setting your API key",
      message: "Setting your API key, please be patient",
      autoClose: false,
      withCloseButton: false,
    });
    sendApiKeyToDjango(apiKey);
    setApiKey("");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setS3Name(e.target.value);
  };

  const handleS3AccessKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setS3AccessKey(e.target.value);
  };

  const handleS3SecretKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setS3SecretKey(e.target.value);
  };

  const handleS3Key = () => {
    notifications.show({
      id: "set-s3-key",
      loading: true,
      title: "Setting your AWS S3 key",
      message: "Setting your AWS S3 key, please be patient",
      autoClose: false,
      withCloseButton: false,
    });
    sendS3KeyToDjango(s3Name, s3AccessKey, s3SecretKey);
    setS3Name("");
    setS3SecretKey("");
    setS3AccessKey("");
  };
  return (
    <>
      <Modal.Root
        data-testid="user_API_Key_modal"
        opened={isOpen}
        onClose={handleClose}
        aria-labelledby="API Key modal"
        size={470}
        centered
      >
        <Modal.Overlay />
        <Modal.Content className={classes.container}>
          <div>
            <div className={classes.title}>
              <FamilyHistoryIconSvg size={20} />
              <div className={classes.titleText}>Flojoy Cloud API Key</div>
            </div>
            <Modal.CloseButton
              data-testid="api-key-close-btn"
              className={classes.closeBtn}
            />
            <div className={classes.oneSubmitButtonLine}>
              <Input
                data-testid="api-key-input"
                type="text"
                onChange={handleApiKeyChange}
                value={apiKey}
                className={classes.inputBox}
              />
              <Button
                data-testid="api-key-input-btn"
                disabled={!apiKey}
                onClick={handleSendAPI}
                className={classes.submitBtn}
              >
                Submit
              </Button>
            </div>
          </div>
          <div>
            <div className={classes.title}>
              <FamilyHistoryIconSvg size={20} />
              <div className={classes.titleText}>OpenAI API Key</div>
            </div>
            <div className={classes.oneSubmitButtonLine}>
              <Input
                data-testid="api-key-input"
                type="text"
                onChange={handleApiKeyChange}
                value={apiKey}
                className={classes.inputBox}
              />
              <Button
                data-testid="api-key-input-btn"
                disabled={!apiKey}
                onClick={handleSendAPI}
                className={classes.submitBtn}
              >
                Submit
              </Button>
            </div>
          </div>
          <div>
            <div className={classes.title}>
              <FamilyHistoryIconSvg size={20} />
              <div className={classes.titleText}>Set S3 Key</div>
            </div>
            <div className={classes.s3Container}>
              <h4 style={{ marginBottom: 0 }}>Name:</h4>
              <Input
                data-testid="s3_name_input"
                type="text"
                onChange={handleNameChange}
                value={s3Name}
                className={classes.inputBox}
              />
              <h4 style={{ marginBottom: 0 }}>Access Key:</h4>
              <Input
                data-testid="s3_access_input"
                type="text"
                onChange={handleS3AccessKeyChange}
                value={s3AccessKey}
                className={classes.inputBox}
              />
              <h4 style={{ marginBottom: 0 }}>Secret Access Key:</h4>
              <Input
                data-testid="s3_secret_input"
                type="text"
                onChange={handleS3SecretKeyChange}
                value={s3SecretKey}
                className={classes.inputBox}
              />
              <Button
                data-testid="s3-submit-btn"
                disabled={!s3SecretKey}
                onClick={handleS3Key}
                className={classes.s3SubmitBtn}
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

export default memo(APIKeyModal);
