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
import { useNavigate } from "react-router-dom";
import { IServerStatus } from "@src/context/socket.context";
import { useSocket } from "@src/hooks/useSocket";
import StatusBar from "@src/routes/common/StatusBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { InterpretersList } from "src/main/python/interpreter";

export const Index = (): JSX.Element => {
  const {
    states: { serverStatus },
  } = useSocket();
  const [pyInterpreters, setPyInterpreters] = useState<InterpretersList | null>(
    null,
  );
  const [selectedInterpreter, setSelectedInterpreter] = useState("");
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
    try {
      await window.api.saveBlocks();
      updateSetupStatus({
        stage: "check-blocks-resource",
        status: "completed",
        message: "Blocks resource is downloaded!",
      });
    } catch (err) {
      console.log("err: ", err);
      updateSetupStatus({
        stage: "check-blocks-resource",
        status: "error",
        message: "Could not download blocks resource :(",
      });
      setErrorTitle("Blocks resource download failed!");
      setErrorDesc(
        "An error ocurred while trying to download blocks resource, check if git is installed on your machine!",
      );
      setErrorActionName("Download Git");
    }
  };

  const checkPythonInstallation = async (force?: boolean): Promise<void> => {
    try {
      const interpreters = await window.api.checkPythonInstallation(force);
      setPyInterpreters(interpreters ?? []);
      updateSetupStatus({
        stage: "check-python-installation",
        status: "running",
        message: "Select a Python interpreter from list below...",
      });
    } catch (err) {
      console.log("err: ", err);
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

  const handleSelectedPyInterpreter = async (interpreter: string) => {
    await window.api.setPythonInterpreter(interpreter);
    setSelectedInterpreter(interpreter);
    updateSetupStatus({
      stage: "check-python-installation",
      status: "completed",
      message: `Using selected python env...`,
    });
  };

  const handleBrowsePyInterpreter = async () => {
    const path = await window.api.browsePyInterpreter();
    if (path) {
      handleSelectedPyInterpreter(path);
    }
  };
  const refreshPyList = async () => {
    console.log("Refreshing python interpreter list...");
    await checkPythonInstallation(true);
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
      case "check-blocks-resource": {
        window.open("https://git-scm.com/downloads");
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
              <Fragment key={idx}>
                <SetupStep status={status.status} message={status.message} />
                {status.stage === "check-python-installation" &&
                  pyInterpreters && (
                    <div className="flex flex-col items-center justify-center gap-2 px-2 pt-2">
                      <div className="flex w-full min-w-fit items-center justify-between gap-2">
                        <Select
                          disabled={selectedInterpreter !== ""}
                          value={undefined}
                          onValueChange={handleSelectedPyInterpreter}
                        >
                          <SelectTrigger className="grow">
                            <SelectValue
                              placeholder={
                                pyInterpreters.length > 0
                                  ? "Please select a Python interpreter"
                                  : "No Python 3.11 interpreter found!"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {pyInterpreters.map((env) => {
                              return (
                                <SelectItem
                                  className="flex w-full cursor-pointer flex-col items-start justify-start"
                                  key={env.path}
                                  value={env.path}
                                >
                                  <div className="font-semibold">
                                    {env.path}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      version:
                                      {` ${env.version.major}.${env.version.minor}`}
                                    </div>
                                    <div className="text-gray-500">
                                      {env.default ? "default" : ""}
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Button
                          disabled={selectedInterpreter !== ""}
                          onClick={refreshPyList}
                          size={"sm"}
                        >
                          Refresh
                        </Button>
                      </div>
                      {pyInterpreters.length == 0 && (
                        <div>
                          <Button
                            className="px-1 font-bold"
                            variant={"link"}
                            onClick={() =>
                              window.open(
                                "https://www.python.org/downloads/release/python-3116/",
                              )
                            }
                          >
                            Click here
                          </Button>{" "}
                          to download Python 3.11 from official website.
                        </div>
                      )}
                      <div className="flex w-full items-center">
                        <hr className="w-full flex-1 border-t-2 border-gray-300" />
                        <span className="mx-4 text-gray-600">OR</span>
                        <hr className="w-full flex-1 border-t-2 border-gray-300" />
                      </div>
                      <Button
                        onClick={handleBrowsePyInterpreter}
                        disabled={selectedInterpreter !== ""}
                      >
                        Find a interpreter
                      </Button>
                    </div>
                  )}
              </Fragment>
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
