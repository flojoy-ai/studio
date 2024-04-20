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
import { Avatar, AvatarImage } from "@/renderer/components/ui/avatar";

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

  const handleAppLoad = async (link: string) => {
    console.log("Loading app", link);
  };

  const data = [
    {
      title: "Simplest Sequence",
      description: "Learn how to create a simple sequence with conditional logic.",
      imagePath: "assets/appGallery/introToLoops.png",
      link: "",
    },
    {
      title: "Sequence - Expected Values and Export",
      description: "Learn how to inject the minimum and maximum expected values into a sequence and export the result. Right click on a test to consult the code and edit the expected values!.",
      imagePath: "assets/appGallery/introToLoops.png",
      link: "",
    },
  ]

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
        <Separator />

        <ScrollArea className="">
          { data.map((SeqExample) => (

              <div className="m-1 min-h-40">
              <div className="flex w-full">
                <Avatar className="m-1 h-36 w-36">
                  <AvatarImage className="object-contain" src={SeqExample.imagePath} />
                </Avatar>
                <div className="px-2" />

                <div className="flex grow flex-col items-start">
                  <div className="text-xl font-semibold">{SeqExample.title}</div>
                  <div className="text-sm font-thin">{SeqExample.description}</div>

                  <div className="py-1" />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      data-testid={SeqExample.title.toLowerCase().split(" ").join("_")}
                      onClick={async () => {
                        await handleAppLoad(SeqExample.link);
                      }}
                    >
                      Load
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};


