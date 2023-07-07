import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo, useState } from "react";
import { Modal, createStyles, Button, Input, Tabs } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import {
  sendCloudApiKeyToDjango,
  sendOpenAIApiKeyToDjango,
  sendS3KeyToDjango,
} from "@src/services/FlowChartServices";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = createStyles((theme, s3Container: boolean) => ({
  tabs: {
    marginTop: "10%",
    marginLeft: "2%",
  },
  container: {
    display: "relative",
    marginLeft: "10%",
    border: `1px solid ${theme.colors.accent5[0]}`,
    gap: 43,
    height: s3Container == false ? 230 : 450,
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
    marginTop: "5%",
    marginLeft: "6.5%",
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
    marginLeft: "6.5%",
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
  s3Title: {
    display: "flex",
    gap: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "5%",
    marginLeft: "15%",
  },
  s3ContainerCSS: {
    marginLeft: "15%",
    marginTop: -15,
  },
  s3SubmitBtn: {
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
    marginLeft: 185,
    marginTop: 5,
  },
}));
const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const {
    cloudApiKey,
    setCloudApiKey,
    openAIApiKey,
    setOpenAIApiKey,
    s3Container,
    setS3Container,
  } = useFlowChartState();
  const { classes } = useStyles(s3Container);
  const [s3Name, setS3Name] = useState<string>("");
  const { s3AccessKey, setS3AccessKey, s3SecretKey, setS3SecretKey } =
    useFlowChartState();

  const handleS3Container = (tab) => {
    if (tab == "s3") {
      setS3Container(true);
      console.log(s3Container);
    } else {
      setS3Container(false);
    }
  };

  const handleCloudApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCloudApiKey(e.target.value);
  };

  const handleOpenAIApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOpenAIApiKey(e.target.value);
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

  const handleClose = () => {
    setS3Container(false);
    setCloudApiKey("");
    setOpenAIApiKey("");
    setS3Name("");
    setS3AccessKey("");
    setS3SecretKey("");
    onClose();
  };

  const handleCloudSendAPI = () => {
    notifications.show({
      id: "set-api-key",
      loading: true,
      title: "Setting your API key",
      message: "Setting your API key, please be patient",
      autoClose: false,
      withCloseButton: false,
    });
    sendCloudApiKeyToDjango(cloudApiKey);
    setCloudApiKey("");
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

  const handleOpenAIAPI = () => {
    notifications.show({
      id: "set-api-key",
      loading: true,
      title: "Setting your OpenAI API key",
      message: "Setting your OpenAI API key, please be patient",
      autoClose: false,
      withCloseButton: false,
    });
    sendOpenAIApiKeyToDjango(openAIApiKey);
    setOpenAIApiKey("");
  };

  return (
    <>
      <Modal.Root
        data-testid="user_API_Key_modal"
        opened={isOpen}
        onClose={handleClose}
        aria-labelledby="API Key modal"
        size={570}
        centered
      >
        <Modal.Overlay />
        <Modal.Content className={classes.container}>
          <Modal.CloseButton
            data-testid="api-key-close-btn"
            className={classes.closeBtn}
          />
          <Tabs
            className={classes.tabs}
            defaultValue="cloud"
            orientation="vertical"
            onTabChange={(tab) => handleS3Container(tab)}
          >
            <Tabs.List>
              <Tabs.Tab value="cloud" data-testid="cloud-tab">
                Flojoy Cloud API
              </Tabs.Tab>
              <Tabs.Tab value="openai" data-testid="openai-tab">
                OpenAI API
              </Tabs.Tab>
              <Tabs.Tab value="s3" data-testid="s3-tab">
                AWS S3 API
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="cloud">
              <div className={classes.title}>
                <FamilyHistoryIconSvg size={20} />
                <div className={classes.titleText}>Flojoy Cloud API Key</div>
              </div>
              <div className={classes.oneSubmitButtonLine}>
                <Input
                  data-testid="cloud-api-key-input"
                  type="text"
                  onChange={handleCloudApiKeyChange}
                  value={cloudApiKey}
                  className={classes.inputBox}
                />
                <Button
                  data-testid="cloud-input-btn"
                  disabled={!cloudApiKey}
                  onClick={handleCloudSendAPI}
                  className={classes.submitBtn}
                >
                  Submit
                </Button>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="openai">
              <div className={classes.title}>
                <FamilyHistoryIconSvg size={20} />
                <div className={classes.titleText}>OpenAI API Key</div>
              </div>
              <div className={classes.oneSubmitButtonLine}>
                <Input
                  data-testid="openai-api-key-input"
                  type="text"
                  onChange={handleOpenAIApiKeyChange}
                  value={openAIApiKey}
                  className={classes.inputBox}
                />
                <Button
                  data-testid="openai-input-btn"
                  disabled={!openAIApiKey}
                  onClick={handleOpenAIAPI}
                  className={classes.submitBtn}
                >
                  Submit
                </Button>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="s3">
              <div className={classes.s3Title}>
                <FamilyHistoryIconSvg size={20} />
                <div className={classes.titleText}>Set S3 Key</div>
              </div>
              <div className={classes.s3ContainerCSS}>
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
            </Tabs.Panel>
          </Tabs>
        </Modal.Content>
      </Modal.Root>
      <Notifications />
    </>
  );
};

export default memo(APIKeyModal);
