import { useEffect, useState, useRef } from "react";
import { AppGalleryLayout } from "@feature/flow_chart_panel/views/AppGalleryLayout";
import { AppGallerySearch } from "@feature/flow_chart_panel/views/AppGallerySearch";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const subjectKeyList = ["fundamentals", "AI", "IO", "DSP"];
const ignoreDir = [".github", "MANIFEST"];

export interface GithubJSON {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url?: string;
  type: string;
  links: object[];
}

interface AppGalleryModalProps {
  isGalleryOpen: boolean;
  setIsGalleryOpen: (open: boolean) => void;
}

export const AppGalleryModal = ({
  isGalleryOpen,
  setIsGalleryOpen,
}: AppGalleryModalProps) => {
  const [selectFields, setSelectFields] = useState([]);
  const [searchData, setSearchData] = useState<GithubJSON[]>([]);
  const turnStoneRef = useRef();

  // fetches the root of the nodes directory in the main branch
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.github.com/repos/flojoy-ai/nodes/contents/?ref=main"
      );
      const raw = await response.json();
      const filtered = raw.filter(
        (obj) => obj["type"] === "dir" && !ignoreDir.includes(obj["name"])
      );
      setSelectFields(
        filtered.map((obj) => (
          <SelectItem key={obj.sha} value={obj.url}>
            {obj.name}
          </SelectItem>
        ))
      );
    };
    fetchData().catch(console.error);
  }, []);

  // This functions fetches the category selected by the user and clears the input
  const onValueChange = async (selectUrl: string) => {
    const response = await fetch(selectUrl);
    const raw: GithubJSON[] = await response.json();
    const filtered = raw.filter((obj) => obj["type"] === "dir");
    setSearchData(filtered);
    turnStoneRef.current?.clear();
  };

  const setOpen = () => {
    setIsGalleryOpen(true);
  };

  return (
    <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" onClick={setOpen}>
          <LayoutGrid />
          App Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className="h-4/5 max-w-5xl items-center justify-center rounded-lg shadow-2xl">
        <DialogHeader className="sticky z-20">
          <DialogTitle className="mt-5 flex flex-row justify-between text-black dark:text-white">
            <div className="ml-6 text-3xl">App Gallery</div>
            <div className="flex basis-2/5 gap-3">
              <div className="w-1/3 pt-1">
                <Select onValueChange={onValueChange}>
                  <SelectTrigger className=" text-sm">Category</SelectTrigger>
                  <SelectGroup>
                    <SelectContent>{selectFields}</SelectContent>
                  </SelectGroup>
                </Select>
              </div>
              <AppGallerySearch
                items={searchData}
                setIsGalleryOpen={setIsGalleryOpen}
                turnStoneRef={turnStoneRef}
              />
            </div>
          </DialogTitle>
          <hr />
        </DialogHeader>
        <ScrollArea className="h-full w-full">
          {subjectKeyList.map((sub, key) => {
            return (
              <AppGalleryLayout
                subjectKey={sub}
                key={key}
                topKey={key}
                setIsGalleryOpen={setIsGalleryOpen}
              />
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
