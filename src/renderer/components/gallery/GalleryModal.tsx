import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
import { LayoutGrid } from "lucide-react";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { getGalleryData } from "@/renderer/utils/GalleryLoader";
import { Separator } from "../ui/separator";
import { GalleryElement } from "./GalleryElement";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IS_CLOUD_DEMO } from "@/renderer/data/constants";

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
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const entries = Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => [
          k,
          v
            .filter((data) => (IS_CLOUD_DEMO ? data.cloudDemoEnabled : true))
            .filter(
              (app) =>
                app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                app.relevantNodes.some((node) =>
                  node.name.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
            ),
        ])
        .filter(([, v]) => v.length > 0),
    );
    // console.log(entries);
    setFilteredData(entries);
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
          <LayoutGrid size={20} className="stroke-muted-foreground" />
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
          {Object.keys(filteredData).length ? (
            Object.entries(filteredData).map(([k, v]) => (
              <div key={k}>
                <div className="text-3xl font-bold">{k.replace("_", " ")}</div>
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
            ))
          ) : (
            <div>
              Found no examples for{" "}
              <span className="font-bold">{searchQuery}</span> in the App
              Gallery.
              <br /> Would you like to search for an example app containing{" "}
              <span className="font-bold">{searchQuery}</span> on{" "}
              <a
                href={"https://docs.flojoy.ai"}
                target="_blank"
                className="text-accent1"
              >
                docs.flojoy.ai
              </a>{" "}
              instead?
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
