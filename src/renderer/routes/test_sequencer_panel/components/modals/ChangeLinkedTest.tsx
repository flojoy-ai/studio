import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Separator } from "@/renderer/components/ui/separator";
import { useAppStore } from "@/renderer/stores/app";
import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ImportType } from "./ImportTestModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { useDiscoverPytestElements } from "@/renderer/hooks/useTestImport";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import { toast } from "sonner";
import { useSequencerModalStore } from "@/renderer/stores/modal";

export const ChangeLinkedTestModal = ({
  isModalOpen,
  setModalOpen,
  handleSubmit,
}: {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  handleSubmit: (path: string, testType: ImportType) => void;
}) => {
  const [availableTests, setAvailableTests] = useState<TestSequenceElement[]>(
    [],
  );
  const [selectedPath, setSelectedPath] = useState<string>("");
  const { openErrorModal } = useSequencerModalStore();

  const { setIsDepManagerModalOpen } = useAppStore(
    useShallow((state) => ({
      setIsDepManagerModalOpen: state.setIsDepManagerModalOpen,
    })),
  );

  const openFilePickerPromise = useDiscoverPytestElements();

  const handleDiscoverPytestElements = () => {
    openFilePickerPromise
      .then((useDiscover) => {
        return useDiscover();
      })
      .then((potentialElementsResult) => {
        potentialElementsResult.match(
          (elements) => {
            setAvailableTests(elements);
          },
          (error) => {
            toast("Error while attempting to discover tests", {
              action: {
                label: "More details",
                onClick: () => {
                  openErrorModal(error.message);
                },
              },
            });
          },
        );
      })
      .catch((error) => {
        // User cancelled the file picker
        console.log(error);
      });
  };

  const handleSubmitByType = (testType: ImportType) => {
    if (testType === "pytest") {
      if (selectedPath === "") {
        toast.error("Please select a test to link to");
      }
      handleSubmit(selectedPath, testType);
    } else {
      window.api.openTestPicker().then((result) => {
        if (!result) {
          return;
        }
        const { filePath } = result;
        handleSubmit(filePath, testType);
      });
    }
    setModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">
          Select a test to link to
        </h2>
        <p className="font-bold">Pytest</p>
        <div className="flex w-[460px] items-center justify-between gap-2">
          <Select onValueChange={setSelectedPath}>
            <SelectTrigger className="overflow-clip">
              <SelectValue placeholder="Select a Test" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Discover a file to display its tests</SelectLabel>
                {availableTests.map((test) => {
                  if (test.type === "test") {
                    return (
                      <SelectItem
                        value={test.path}
                      >{`...${test.path.slice(-35)}`}</SelectItem>
                    );
                  }
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="w-52 justify-end">
            <Button
              variant={"outline"}
              onClick={() => handleDiscoverPytestElements()}
              data-testid="pytest-btn"
            >
              Discover Pytest
            </Button>
          </div>
        </div>
        <Button
          variant={"outline"}
          onClick={() => handleSubmitByType("pytest")}
        >
          {" "}
          Submit Selected Test{" "}
        </Button>
        <Separator className="bg-muted" />
        <p className="font-bold">Python Script</p>
        <Button
          variant={"outline"}
          onClick={() => handleSubmitByType("python")}
        >
          Select a Python Script
        </Button>
        <div className="flex justify-between">
          <div className="grow" />
          <div className="justify-end">
            <Button
              variant={"link"}
              className="text-xs text-muted-foreground"
              onClick={() => setIsDepManagerModalOpen(true)}
            >
              <ExternalLinkIcon size={15} className="mr-1" /> Dependency Manager
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
