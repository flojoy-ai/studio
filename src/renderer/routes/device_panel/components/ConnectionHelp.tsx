import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs";
import { PropsWithChildren } from "react";

type LinkProps = {
  href: string;
};

const Link = ({ href, children }: PropsWithChildren<LinkProps>) => {
  return (
    <a
      className="underline duration-200 hover:text-muted-foreground"
      href={href}
    >
      {children}
    </a>
  );
};

export const ConnectionHelp = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Connection Help</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Connection Help</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden">
          <Tabs defaultValue="connect" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-background">
              <TabsTrigger className="text-xs md:text-sm" value="connect">
                Connect your device
              </TabsTrigger>
              <TabsTrigger className="text-xs md:text-sm" value="find">
                Find your device
              </TabsTrigger>
              <TabsTrigger className="text-xs md:text-sm" value="debug">
                Debug your connection
              </TabsTrigger>
              <TabsTrigger className="text-xs md:text-sm" value="import">
                Import a connection block
              </TabsTrigger>
            </TabsList>
            <div className="py-2" />
            <TabsContent className="relative h-80" value="connect">
              <div className="py-2" />
              <div className="flex justify-evenly">
                <div className="flex w-fit flex-col items-center">
                  <img src="assets/connectionHelp/connect1.png" width={224} />
                  <div className="mt-1 text-center text-sm text-muted-foreground">
                    Connect with an Ethernet cable
                  </div>
                </div>
                <div className="flex w-fit flex-col items-center">
                  <img src="assets/connectionHelp/connect2.png" width={256} />
                  <div className="mt-1 text-center text-sm text-muted-foreground">
                    Connect with an USB ("serial") cable
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0">
                <div className="h-full text-lg">
                  <span className="font-bold">Step 1: </span>
                  Connect your computer to your hardware device with an Ethernet
                  or USB cable
                </div>
                <div className="py-2" />
                <div className="text-xs">
                  * Today, most hardware instruments have Ethernet or USB ports.
                  If your instruments are older, they may only have{" "}
                  <Link href="https://en.wikipedia.org/wiki/IEEE-488">
                    GPIB (“IEEE-488”)
                  </Link>{" "}
                  or{" "}
                  <Link href="https://en.wikipedia.org/wiki/RS-232">
                    RS-232 ports
                  </Link>
                  . In this case, we highly recommend a GPIB-to-USB controller
                  such the{" "}
                  <Link href="https://prologix.biz/product/gpib-usb-controller/">
                    Prologix
                  </Link>{" "}
                  or RS232-to-USB controller such as the{" "}
                  <Link href="https://www.startech.com/en-ca/cards-adapters/icusb232v2">
                    StarTech
                  </Link>
                  . Please see our guides on{" "}
                  <Link href="https://docs.flojoy.ai/prologix/gpib-to-usb/">
                    GPIB-to-USB
                  </Link>{" "}
                  and{" "}
                  <Link href="https://docs.flojoy.ai/startech/rs232-to-usb/">
                    RS232-to-USB
                  </Link>{" "}
                  for more info.
                </div>
              </div>
            </TabsContent>
            <TabsContent className="relative h-80" value="find">
              <div className="py-2" />
              <div className="flex justify-evenly">
                <div>
                  <h2 className="mb-1 ml-1 font-bold text-accent1">Serial</h2>
                  <div className="h-32 w-72 rounded-md bg-secondary p-2">
                    <h3 className="text-muted-foreground">
                      USB-connected devices appear here with their port number
                    </h3>
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 ml-1 font-bold text-accent1">VISA</h2>
                  <div className="h-32 w-72 rounded-md bg-secondary p-2">
                    <h3 className="text-muted-foreground">
                      Ethernet-connected devices appear here with their IP
                      address
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0">
                <div className="h-full text-lg">
                  <span className="font-bold">Step 2: </span>
                  Find your device under the "Hardware Devices" tab
                </div>
                <div className="py-2" />
                <div className="text-xs">
                  After your instrument is physically connected to your computer
                  via a USB or ethernet cable (see Step 1), then it should be
                  discoverable by Flojoy and listed under the “Hardware Devices”
                  tab. You may have to click the “Refresh” button for it to
                  appear. Devices connected by Ethernet will show up under VISA;
                  deviced connected by USB will show up under Serial.
                </div>
              </div>
            </TabsContent>
            <TabsContent className="relative h-80" value="debug">
              <div className="flex justify-center">
                <img src="assets/connectionHelp/debug1.png" width={360} />
              </div>
              <div className="py-2" />
              <div className="absolute bottom-0">
                <div className="h-full text-lg">
                  <span className="font-bold">Step 3: </span>
                  Debug your connection
                </div>
                <div className="py-4" />
                <div className="text-xs">
                  If your connected device does not show up under the Hardware
                  Devices tab, then click the “Debug” button to troubleshoot.
                  Please see our{" "}
                  <Link href="https://docs.flojoy.ai/studio/visa-usb/">
                    troubleshooting FAQ
                  </Link>{" "}
                  and join our free support chat where an engineer will help you
                  through this initial hurdle.
                </div>
              </div>
            </TabsContent>
            <TabsContent className="relative h-96" value="import">
              <div className="flex justify-center">
                <img src="assets/connectionHelp/import1.png" width={360} />
              </div>
              <div className="absolute bottom-0">
                <div className="h-full text-lg">
                  <span className="font-bold">Step 4: </span>
                  Import a connection block
                </div>
                <div className="py-2" />
                <div className="text-xs">
                  Supported Flojoy hardware will have a connection block that
                  creates the initial connection with the instrument. To find
                  this block, go to the Add Block sidebar and search the
                  instrument name or manufacturer (example searches: Rigol,
                  Tektronix, Keysight, etc). USB-connected devices have
                  general-purpose OPEN_SERIAL and SERIAL_WRITE blocks that can
                  be used for any USB-connected device. If you don’t see blocks
                  for your instrument, please inquire in our free support chat.{" "}
                  <br />
                  <br />
                  After, adding the connection block to your canvas, please
                  click on it to verify that the correct connect device has been
                  autoselected. If n/a is displayed under “DEVICE:”, please go
                  back to Step 2 and ask an engineer on our free support chat.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
