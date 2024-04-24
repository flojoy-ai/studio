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
import { useDiscoverElements } from "@/renderer/hooks/useTestImport";
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
  handleSubmit: (
    path: string,
    testType: ImportType,
    args: string[] | undefined,
  ) => void;
}) => {
  const [availableTests, setAvailableTests] = useState<TestSequenceElement[]>(
    [],
  );
  const [selectedTestName, setSelectedPath] = useState<string>("");
  const { openErrorModal } = useSequencerModalStore();

  const { setIsDepManagerModalOpen } = useAppStore(
    useShallow((state) => ({
      setIsDepManagerModalOpen: state.setIsDepManagerModalOpen,
    })),
  );

  const openFilePickerPromise = useDiscoverElements();

  const handleDiscoverElements = () => {
    openFilePickerPromise
      .then((useDiscover) => {
        return useDiscover();
      })
      .then((potentialElementsResult) => {
        potentialElementsResult.match(
          (elements) => {
            setAvailableTests(elements);
            toast.info("Tests discovered successfully");
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

  const handleSubmitIndividualTest = () => {
    if (selectedTestName === "") {
      toast.error("Please select a test to link to");
    }
    const test = availableTests.find(
      (test) => test.type === "test" && test.testName === selectedTestName,
    );
    if (test?.type !== "test" || test.testType === "placeholder") {
      return;
    }
    handleSubmit(test.path, test.testType, test.args);
    setModalOpen(false);
  };

  const handleSubmitPythonScript = () => {
    window.api.openTestPicker().then((result) => {
      if (!result) {
        return;
      }
      const { filePath } = result;
      if (!filePath.endsWith(".py")) {
        toast.error("Please select a Python file");
        return;
      }
      handleSubmit(filePath, "python", undefined);
      setModalOpen(false);
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">
          Select a test to link to
        </h2>
        <p className="font-bold">Pytest & Robot Framework</p>
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
                      <SelectItem value={test.testName}>
                        {test.testName.length > 35
                          ? `...${test.testName.slice(-35)}`
                          : test.testName}
                      </SelectItem>
                    );
                  }
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="w-32"
            variant={"outline"}
            onClick={handleDiscoverElements}
            data-testid="discover-btn"
          >
            Discover
          </Button>
        </div>
        <Button
          variant={"outline"}
          onClick={() => handleSubmitIndividualTest()}
        >
          Submit Selected Test
        </Button>
        <Separator className="bg-muted" />
        <p className="font-bold">Python Script</p>
        <Button variant={"outline"} onClick={() => handleSubmitPythonScript()}>
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
