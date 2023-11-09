import { Fragment, useEffect, useState } from "react";
import { SetupStatus } from "@src/types/status";
import SetupStep from "@src/components/index/SetupStep";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@src/components/ui/alert-dialog";
import { Button } from "@src/components/ui/button";
// import { useCaptainStateStore } from "@src/stores/lifecycle";
import { useNavigate } from "react-router-dom";
import { IServerStatus } from "@src/context/socket.context";
import { useSocket } from "@src/hooks/useSocket";
import StatusBar from "@src/routes/command/StatusBar";

export const Index = (): JSX.Element => {
  //   const captainReady = useCaptainStateStore((state) => state.ready);
  const {
    states: { serverStatus },
  } = useSocket();
  const [setupStatuses, setSetupStatuses] = useState<SetupStatus[]>([
    {
      status: "running",
      stage: "check-blocks-resource",
      message: "Looking for blocks resource...",
    },
    {
      status: "pending",
      stage: "check-python-installation",
      message: "Check for python ~3.11 installation.",
    },
    {
      status: "pending",
      stage: "install-dependencies",
      message: "Configure all the magic behind Flojoy Studio.",
    },
    {
      status: "pending",
      stage: "spawn-captain",
      message: "Start the Flojoy Studio backend.",
    },
  ]);

  const [showError, setShowError] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>("");
  const [errorDesc, setErrorDesc] = useState<string>("");
  const [errorActionName, setErrorActionName] = useState<string>("");
  const navigate = useNavigate();

  const checkBlocksResource = async () => {
    await window.api.saveBlocks();
    updateSetupStatus({
      stage: "check-blocks-resource",
      status: "completed",
      message: "Blocks resource is downloaded!",
    });
  };

  const checkPythonInstallation = async (): Promise<void> => {
    try {
      const data = await window.api.checkPythonInstallation();
      updateSetupStatus({
        stage: "check-python-installation",
        status: "completed",
        message: `Python ${data.split(" ")[1]} is installed!`,
      });
    } catch (err) {
      updateSetupStatus({
        stage: "check-python-installation",
        status: "error",
        message: "Cannot find any Python 3.11 installation on this machine :(",
      });
      setErrorTitle("Could not find Python 3.11 :(");
      setErrorDesc("Please install Python 3.11 and try again!");
      setErrorActionName("Download");
    }
  };

  const installDependencies = async (): Promise<void> => {
    try {
      await window.api.installPipx();
      await window.api.pipxEnsurepath();
      await window.api.installPoetry();
      await window.api.installDependencies();

      updateSetupStatus({
        stage: "install-dependencies",
        status: "completed",
        message: "Finished setting up all the magic behind Flojoy Studio.",
      });
    } catch (err) {
      updateSetupStatus({
        stage: "install-dependencies",
        status: "error",
        message: "Something went wrong when installing dependencies...",
      });
      setErrorTitle("Something went wrong :(");
      // TODO: automate the log reporting part
      setErrorDesc(
        "Sorry about that! Please open the log folder and send the log to us on Discord!",
      );
      setErrorActionName("Open Log Folder");
    }
  };

  const spawnCaptain = async (): Promise<void> => {
    try {
      await window.api.spawnCaptain();
    } catch (err) {
      updateSetupStatus({
        stage: "spawn-captain",
        status: "error",
        message: "Something went wrong when starting Flojoy Studio...",
      });
      setErrorTitle("Something went wrong :(");
      // TODO: automate the log reporting part
      setErrorDesc(
        "Sorry about that! Please open the log folder and send the log to us on Discord!",
      );
      setErrorActionName("Open Log Folder");
    }
  };

  const errorAction = async (): Promise<void> => {
    const setupError = setupStatuses.find(
      (status) => status.status === "error",
    );
    switch (setupError?.stage) {
      case "check-python-installation": {
        window.open("https://www.python.org/downloads/release/python-3116/");
        break;
      }
      case "install-dependencies": {
        await window.api.openLogFolder();
        break;
      }
      case "spawn-captain": {
        await window.api.openLogFolder();
        break;
      }
    }
  };

  const updateSetupStatus = (setupStatus: SetupStatus): void => {
    setSetupStatuses((prev) => {
      return prev.map((status) => {
        if (status.stage === setupStatus.stage) {
          return {
            ...setupStatus,
          };
        }
        return status;
      });
    });
  };

  useEffect(() => {
    // Kick off the setup process with this useEffect
    checkBlocksResource();
  }, []);

  useEffect(() => {
    // The main logic for the setup process
    const hasError = setupStatuses.find((status) => status.status === "error");
    const isRunning = setupStatuses.find(
      (status) => status.status === "running",
    );
    if (hasError) {
      // no need to trigger the next step if there is an error
      setShowError(true);
      return;
    }
    if (isRunning) {
      // or something is already running...
      return;
    }

    const nextStep = setupStatuses.find(
      (status) => status.status === "pending",
    );
    switch (nextStep?.stage) {
      case "check-python-installation": {
        updateSetupStatus({
          stage: "check-python-installation",
          status: "running",
          message: "Making sure Python 3.11 is installed on this machine.",
        });
        checkPythonInstallation();
        break;
      }
      case "install-dependencies": {
        updateSetupStatus({
          stage: "install-dependencies",
          status: "running",
          message:
            "Working hard to set everything up! This may take a while for the first time...",
        });
        installDependencies();
        break;
      }
      case "spawn-captain": {
        updateSetupStatus({
          stage: "spawn-captain",
          status: "running",
          message: "Almost there, starting Flojoy Studio...",
        });
        spawnCaptain();
        break;
      }
    }
  }, [setupStatuses]);

  useEffect(() => {
    if (
      ![IServerStatus.OFFLINE, IServerStatus.CONNECTING].includes(serverStatus)
    ) {
      navigate("/flowchart");
    }
  }, [navigate, serverStatus]);

  return (
    <div className="flex h-screen flex-col bg-muted">
      <div className="flex grow flex-col items-center p-4">
        <div className="py-4"></div>
        <div className="text-4xl font-bold">Welcome to Flojoy Studio!</div>
        <div className="py-1"></div>
        <div className="">
          We are excited to have you here, please give us some time to get
          everything ready :)
        </div>

        <div className="py-4"></div>
        <div className="flex w-full items-center justify-center">
          <div className="w-fit rounded-xl bg-background p-4">
            {setupStatuses.map((status, idx) => (
              <SetupStep
                status={status.status}
                key={idx}
                message={status.message}
              />
            ))}
          </div>
        </div>

        <div className="py-4"></div>

        {setupStatuses.find((status) => status.status === "error") && (
          <Button
            onClick={async (): Promise<void> =>
              await window.api.restartFlojoyStudio()
            }
          >
            Retry
          </Button>
        )}

        <AlertDialog open={showError} onOpenChange={setShowError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{errorTitle}</AlertDialogTitle>
              <AlertDialogDescription>{errorDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={errorAction}>
                {errorActionName}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <StatusBar />
    </div>
  );
};
