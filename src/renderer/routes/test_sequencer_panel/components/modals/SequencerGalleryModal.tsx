import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
import { LayoutGrid } from "lucide-react";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { Separator } from "@/renderer/components/ui/separator";
import { Button } from "@/renderer/components/ui/button";
import { useDownloadAndImportExampleSequence } from "@/renderer/hooks/useTestSequencerProject";

type AppGalleryModalProps = {
  isGalleryOpen: boolean;
  setIsGalleryOpen: (open: boolean) => void;
};

export const SequencerGalleryModal = ({
  isGalleryOpen,
  setIsGalleryOpen,
}: AppGalleryModalProps) => {
  const setOpen = () => {
    setIsGalleryOpen(true);
  };

  const useDownloadAndImport = useDownloadAndImportExampleSequence();

  const handleSequenceLoad = (url: string) => {
    useDownloadAndImport(url);
    setIsGalleryOpen(false);
  };

  const data = [
    {
      title: "Creating Sequences with Conditional",
      description:
        "Learn how to create a simple sequence with conditional logic.",
      url: "https://github.com/flojoy-ai/test-sequencer-conditional-example",
    },
    {
      title: "Test Step with Expected and Exported Values",
      description:
        "Learn how to inject the minimum and maximum expected values into a test and export the result.",
      url: "https://github.com/flojoy-ai/test-sequencer-expected-exported-example.git",
    },
  ];

  return (
    <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={setOpen}
          data-testid="app-gallery-btn"
          className="gap-2"
          variant="ghost"
        >
          <LayoutGrid size={20} className="stroke-muted-foreground" />
          Sequence Gallery
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-4/5 max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="text-3xl">Sequence Gallery</div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="">
          {data.map((SeqExample) => (
            <>
              <Separator />
              <div className="1 inline-flex min-h-20 w-full items-center">
                <div className="flex w-3/4">
                  <div className="flex grow flex-col items-start">
                    <div className="text-xl font-semibold">
                      {SeqExample.title}
                    </div>
                    <div className="text-sm font-thin">
                      {SeqExample.description}
                    </div>
                  </div>
                </div>
                <div className="grow" />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-6 gap-2"
                  data-testid={SeqExample.title
                    .toLowerCase()
                    .split(" ")
                    .join("_")}
                  onClick={() => {
                    handleSequenceLoad(SeqExample.url);
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
