import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { Spinner } from "@/renderer/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";
import { Input } from "@/renderer/components/ui/input";
import { toast } from "sonner";

type Props = {
  handleDepManagerModalOpen: (open: boolean) => void;
  isDepManagerModalOpen: boolean;
};

const DepManagerModal = ({
  isDepManagerModalOpen,
  handleDepManagerModalOpen,
}: Props) => {
  const [allDependencies, setAllDependencies] = useState<PythonDependency[]>(
    [],
  );
  const [userDependencies, setUserDependencies] = useState<PythonDependency[]>(
    [],
  );
  const [installDependency, setInstallDependency] = useState<string>("");
  const [depGroups, setDepGroups] = useState<PoetryGroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>("");
  const [checkAllDependencies, setCheckAllDependencies] =
    useState<boolean>(false);

  const handleUpdate = useCallback(async () => {
    setIsFetching(true);
    setMsg("Fetching dependencies...");
    const deps = await window.api.poetryShowTopLevel();
    const userDeps = await window.api.poetryShowUserGroup();
    const groups = await window.api.poetryGetGroupInfo();
    setAllDependencies(deps);
    setUserDependencies(userDeps);
    setDepGroups(groups);
    setIsFetching(false);
  }, []);

  const handleGroupInstall = useCallback(async (groupName: string) => {
    setMsg(`Installing ${groupName} ...`);
    setIsLoading(true);
    await window.api.poetryInstallDepGroup(groupName);
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserDepInstall = useCallback(async (depName: string) => {
    setMsg(`Installing ${depName} ...`);
    setIsLoading(true);
    try {
      await window.api.poetryInstallDepUserGroup(depName);
    } catch (e) {
      toast.error(`Error installing ${depName}.`);
    }
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGroupUninstall = useCallback(async (groupName: string) => {
    setMsg(`Removing ${groupName} ...`);
    setIsLoading(true);
    await window.api.poetryUninstallDepGroup(groupName);
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserDepUninstall = useCallback(async (depName: string) => {
    setMsg(`Removing ${depName} ...`);
    setIsLoading(true);
    try {
      await window.api.poetryUninstallDepUserGroup(depName);
    } catch (e) {
      toast.error(`Error uninstalling ${depName}.`);
    }
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getButtonLabel = useCallback((status: PoetryGroupInfo["status"]) => {
    switch (status) {
      case "installed":
        return "Uninstall";
      case "dne":
        return "Install";
      default:
        return "Unknown";
    }
  }, []);

  useEffect(() => {
    if (isDepManagerModalOpen) {
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDepManagerModalOpen]);

  useEffect(() => {
    window.api.subscribeToElectronLogs((data) => {
      if (data.trimStart().startsWith("•")) {
        setMsg(data);
      }
    });
  }, []);

  return (
    <Dialog
      open={isDepManagerModalOpen}
      onOpenChange={handleDepManagerModalOpen}
    >
      <DialogContent className="flex h-4/5 max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl">Dependency Manager</DialogTitle>
          <DialogDescription>
            Here you can manage all the Python dependencies for Flojoy.
          </DialogDescription>
        </DialogHeader>

        {!checkAllDependencies ? (
          <div className="flex h-full flex-col justify-between">
            <ScrollArea className="h-full p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">Flojoy Extensions</div>
              </div>
              <div className="py-2" />
              <div>
                {depGroups.length === 0 && (
                  <div className="flex justify-center">
                    <Spinner className="text-center" />
                  </div>
                )}
                {depGroups.map((group) => {
                  return (
                    <div className="flex p-1" key={group.name}>
                      <div className="w-32">{group.name}</div>
                      <div>{group.description}</div>
                      <div className="grow" />
                      <Button
                        data-testid={`${group.name}-${getButtonLabel(
                          group.status,
                        )}`}
                        disabled={isLoading || group.name === "blocks"}
                        variant={
                          group.status === "installed"
                            ? "destructive"
                            : "default"
                        }
                        onClick={() => {
                          if (group.status === "installed") {
                            handleGroupUninstall(group.name);
                          } else {
                            handleGroupInstall(group.name);
                          }
                        }}
                      >
                        {getButtonLabel(group.status)}
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="py-2" />

              <div className="py-2" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">User Dependencies</div>
              </div>
              <div className="py-2" />
              <div className="flex">
                <div className="flex-auto items-center gap-1.5 pl-1">
                  <Input
                    id="deps"
                    placeholder="Enter dependencies separated by spaces (e.g., numpy pytest==7.4.4)"
                    value={installDependency}
                    onChange={(event) => {
                      setInstallDependency(event.target.value);
                    }}
                  />
                </div>
                <Button
                  className="ml-4"
                  disabled={isLoading}
                  variant={"default"}
                  onClick={() => {
                    handleUserDepInstall(installDependency);
                  }}
                >
                  Install
                </Button>
              </div>
              <div className="py-2" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDependencies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {isLoading || isFetching
                          ? "Loading installed libraries..."
                          : "No dependencies installed."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    userDependencies.map((dep) => (
                      <TableRow key={dep.name}>
                        <TableCell>{dep.name}</TableCell>
                        <TableCell>{dep.version}</TableCell>
                        <TableCell>{dep.description}</TableCell>
                        <TableCell>
                          <Button
                            disabled={isLoading}
                            variant="ghost"
                            className="h-8 w-16 p-0 text-xs"
                            onClick={() => handleUserDepUninstall(dep.name)}
                          >
                            Uninstall
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="py-2" />
            </ScrollArea>
            <div className="flex justify-between text-xs text-muted-foreground">
              <div className="mt-4 flex justify-start">
                {!isLoading && !isFetching ? (
                  <p> Dependency Manager Idle </p>
                ) : (
                  <p> {msg} </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  variant={"link"}
                  onClick={() => setCheckAllDependencies(true)}
                >
                  <p className="mt-2 text-xs text-muted-foreground">
                    {" "}
                    Consult all dependencies{" "}
                  </p>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            <div>
              <div className="py-2" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">All Dependencies</div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDependencies
                    .filter((dep) => dep.installed)
                    .map((dep) => (
                      <TableRow key={dep.name}>
                        <TableCell>{dep.name}</TableCell>
                        <TableCell>{dep.version}</TableCell>
                        <TableCell>{dep.description}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <div className="py-2" />

              <div className="flex justify-start">
                <Button
                  variant={"link"}
                  onClick={() => setCheckAllDependencies(false)}
                >
                  <p className="mt-2 text-xs text-muted-foreground">Back</p>
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepManagerModal;
