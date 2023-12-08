import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@src/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import { useEffect, useState } from "react";
import { PythonDependency } from "src/types/poetry";

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

  const handleGetAllDependencies = async () => {
    const data = await window.api.poetryShowTopLevel();
    setAllDependencies(data);
  };

  useEffect(() => {
    handleGetAllDependencies();
  }, [isDepManagerModalOpen]);

  return (
    <Dialog
      open={isDepManagerModalOpen}
      onOpenChange={handleDepManagerModalOpen}
    >
      <DialogContent className="h-4/5 max-w-5xl">
        <div>
          <DialogHeader>
            <DialogTitle>Dependency Manager</DialogTitle>
            <DialogDescription>
              Here you can manage all the Python dependencies for Flojoy.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2" />
          <div className="text-2xl font-bold">All Dependencies</div>
          <div className="py-2" />
          <div className="">
            <ScrollArea className="h-64 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="">Version</TableHead>
                    <TableHead className="">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDependencies.map((dep) => (
                    <TableRow>
                      <TableCell>{dep.name}</TableCell>
                      <TableCell>{dep.version}</TableCell>
                      <TableCell>{dep.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepManagerModal;
