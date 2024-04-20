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
import { useImportAllSequencesInFolder } from "@/renderer/hooks/useTestSequencerProject";

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

  const useImport = useImportAllSequencesInFolder();

  const handleSequenceLoad = async (BaseFolderName: string) => {
    const relativePath = `src/renderer/data/apps/sequencer/${BaseFolderName}/`;
    await useImport(relativePath);
    setIsGalleryOpen(false);
  };

  const data = [
    {
      title: "Creating Sequences with Conditional",
      description: "Learn how to create a simple sequence with conditional logic.",
      path: "conditional",
    },
    {
      title: "Test Step with Expected and Exported Values",
      description: "Learn how to inject the minimum and maximum expected values into a test and export the result. Right-click on a test to consult the code and edit the expected values!",
      path: "expected_exported_values",
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
            <div className="inline-flex items-center 1 min-h-20 w-full">
              <div className="flex w-3/4">
                <div className="flex grow flex-col items-start">
                  <div className="text-xl font-semibold">{SeqExample.title}</div>
                  <div className="text-sm font-thin">{SeqExample.description}</div>
                </div>
              </div>
              <div className="grow" />
              <Button
                variant="outline"
                size="sm"
                className="gap-2 ml-6"
                data-testid={SeqExample.title.toLowerCase().split(" ").join("_")}
                onClick={async () => {
                  await handleSequenceLoad(SeqExample.path);
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


