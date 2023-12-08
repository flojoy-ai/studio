import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { Spinner } from "@src/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";

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

  const [depGroups, setDepGroups] = useState<PoetryGroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [msg, setMsg] = useState<string>("");

  const handleUpdate = useCallback(async () => {
    const deps = await window.api.poetryShowTopLevel();
    const groups = await window.api.poetryGetGroupInfo();
    setAllDependencies(deps);
    setDepGroups(groups);
  }, []);

  const handleGroupInstall = useCallback(async (groupName: string) => {
    setMsg("Installing...");
    setIsLoading(true);
    await window.api.poetryInstallDepGroup(groupName);
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGroupUninstall = useCallback(async (groupName: string) => {
    setMsg("Removing...");
    setIsLoading(true);
    await window.api.poetryUninstallDepGroup(groupName);
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
      <DialogContent className="h-4/5 max-w-5xl">
        <div>
          <DialogHeader>
            <DialogTitle className="text-3xl">Dependency Manager</DialogTitle>
            <DialogDescription>
              Here you can manage all the Python dependencies for Flojoy.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2" />

          <div className="text-2xl font-bold">Extensions</div>
          <div className="py-2" />
          <div>
            {depGroups.map((group) => {
              return (
                <div className="flex p-1" key={group.name}>
                  <div className="w-32">{group.name}</div>
                  <div>{group.description}</div>
                  <div className="grow" />
                  <Button
                    disabled={isLoading}
                    variant={
                      group.status === "installed" ? "destructive" : "default"
                    }
                    onClick={() => {
                      if (group.status === "installed") {
                        handleGroupUninstall(group.name);
                      } else {
                        handleGroupInstall(group.name);
                      }
                    }}
                  >
                    {isLoading ? <Spinner /> : getButtonLabel(group.status)}
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="py-2" />

          <div className="mx-auto w-96 text-center">
            {isLoading ? (
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {msg}
              </div>
            ) : (
              <div>Dependency Manager Idle</div>
            )}
          </div>

          <div className="py-2" />
          <div className="text-2xl font-bold">All Dependencies</div>
          <div className="py-2" />
          <ScrollArea className="h-80 rounded-md border">
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepManagerModal;
