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
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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

  const [searchQuery, setSearchQuery] = useState("");
  const data = getGalleryData();
  const [filteredData, setFilteredData] = useState(Object.entries(data));

  useEffect(() => {
    setFilteredData(
      Object.entries(data).map(([k, v]) => [
        k,
        v.filter(
          (app) =>
            app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.relevantNodes.some((node) =>
              node.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        ),
      ]),
    );
  }, [searchQuery]);

  return (
    <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={setOpen}
          data-testid="app-gallery-btn"
          className="gap-2"
          variant="ghost"
        >
          <LayoutGrid />
          App Gallery
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-4/5 max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="text-3xl">App Gallery</div>
          </DialogTitle>
          <div className="py-1" />
          <Input
            placeholder="Search"
            value={searchQuery}
            className="sticky"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </DialogHeader>

        <ScrollArea className="">
          {filteredData
            .filter(([, v]) => v.length > 0)
            .map(([k, v]) => (
              <div key={k}>
                <div className="text-3xl font-bold">{k}</div>
                <Separator className="my-1" />
                <div className="grid grid-cols-2">
                  {v.map((app) => (
                    <GalleryElement
                      key={app.title}
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
