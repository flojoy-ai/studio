import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs";
import { ShellCommandOutput } from "./ShellCommandOutput";
import { PingTab } from "./PingTab";

export const DebugMenu = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Debug Menu</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Debug</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden">
          <Tabs defaultValue="ping" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-background">
              <TabsTrigger className="text-xs md:text-sm" value="ping">
                Check Connection
              </TabsTrigger>
              <TabsTrigger className="text-xs md:text-sm" value="netstat">
                Network Connections
              </TabsTrigger>
              <TabsTrigger className="text-xs md:text-sm" value="ifconfig">
                IP Addresses
              </TabsTrigger>
              <TabsTrigger
                className="text-xs md:text-sm"
                value="python-packages"
              >
                Python Packages
              </TabsTrigger>
              <TabsTrigger className="text-xs md:text-sm" value="pyvisa-info">
                PyVISA
              </TabsTrigger>
            </TabsList>
            <div className="py-2" />
            <TabsContent className="h-96" value="ping">
              <PingTab />
            </TabsContent>
            <TabsContent value="netstat">
              <ShellCommandOutput command={window.api.netstat} />
            </TabsContent>
            <TabsContent value="ifconfig">
              <ShellCommandOutput command={window.api.ifconfig} />
            </TabsContent>
            <TabsContent value="python-packages">
              <ShellCommandOutput command={window.api.listPythonPackages} />
            </TabsContent>
            <TabsContent value="pyvisa-info">
              <ShellCommandOutput command={window.api.pyvisaInfo} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
