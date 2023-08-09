import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutGrid } from "lucide-react";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { getGalleryData } from "@src/utils/GalleryLoader";
import { Separator } from "../ui/separator";
import { GalleryElement } from "./GalleryElement";

type AppGalleryModalProps = {
  isGalleryOpen: boolean;
  setIsGalleryOpen: (open: boolean) => void;
};

export const GalleryModal = ({
  isGalleryOpen,
  setIsGalleryOpen,
}: AppGalleryModalProps) => {
  const setOpen = () => {
    setIsGalleryOpen(true);
  };

  const data = getGalleryData();

  return (
    <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="app-gallery-btn"
          variant="outline"
          className="gap-2"
          onClick={setOpen}
        >
          <LayoutGrid />
          App Gallery
        </Button>
      </DialogTrigger>

      <DialogContent className="h-4/5 max-w-5xl">
        <DialogHeader className="sticky">
          <DialogTitle>
            <div className="text-3xl">App Gallery</div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="">
          {Object.entries(data).map(([k, v]) => (
            <div key={k}>
              <div className="text-3xl font-bold">{k}</div>
              <Separator className="my-1" />
              <div className="grid grid-cols-2">
                {v.map((app) => (
                  <GalleryElement
                    galleryApp={app}
                    setIsGalleryOpen={setIsGalleryOpen}
                  />
                ))}
              </div>
              <div className="py-2" />
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
