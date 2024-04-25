import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { Separator } from "@/renderer/components/ui/separator";
import { Button } from "@/renderer/components/ui/button";
import { useImportAllSequencesInFolder } from "@/renderer/hooks/useTestSequencerProject";

type SequencerGalleryModalProps = {
  isGalleryOpen: boolean;
  setIsGalleryOpen: (open: boolean) => void;
};

export const SequencerGalleryModal = ({
  isGalleryOpen,
  setIsGalleryOpen,
}: SequencerGalleryModalProps) => {
  const importSequence = useImportAllSequencesInFolder();

  const handleSequenceLoad = (relativePath: string) => {
    importSequence(relativePath, true);
    setIsGalleryOpen(false);
  };

  const data = [
    {
      title: "Creating Sequences with Conditional",
      description:
        "Learn how to create a simple sequence with conditional logic.",
      dirPath: "examples/test-sequencer-conditional-example/",
    },
    {
      title: "Test Step with Expected and Exported Values",
      description:
        "Learn how to inject the minimum and maximum expected values into a test and export the result.",
      dirPath: "examples/test-sequencer-expected-exported-example/",
    },
    {
      title: "Robot Framework & Flojoy",
      description:
        "Learn how to inject the minimum and maximum expected values into a robot test and export the result.",
      dirPath: "examples/test-sequencer-robot-framework-example/",
    },
  ];

  return (
    <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
      <DialogContent className="flex h-4/5 max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="text-3xl">Sequence Gallery</div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="">
          {data.map((seqExample) => (
            <>
              <Separator />
              <div className="1 inline-flex min-h-20 w-full items-center">
                <div className="flex w-3/4">
                  <div className="flex grow flex-col items-start">
                    <div className="text-xl font-semibold">
                      {seqExample.title}
                    </div>
                    <div className="text-sm font-thin">
                      {seqExample.description}
                    </div>
                  </div>
                </div>
                <div className="grow" />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-6 gap-2"
                  data-testid={seqExample.title
                    .toLowerCase()
                    .split(" ")
                    .join("_")}
                  onClick={() => {
                    handleSequenceLoad(seqExample.dirPath);
                  }}
                >
                  Load
                </Button>
              </div>
            </>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
