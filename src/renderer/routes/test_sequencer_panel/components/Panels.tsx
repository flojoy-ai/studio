import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/renderer/components/ui/tabs";
import { CloudPanel } from "./panels/CloudPanel";
import { ControlPanel } from "./panels/ControlPanel";

export function TabsDemo() {
  return (
    <Tabs defaultValue="control" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="control">Control Panel</TabsTrigger>
        <TabsTrigger value="cloud">Cloud Panel</TabsTrigger>
      </TabsList>
      <TabsContent value="cloud">
        <Card>
          <CardHeader>
            <CardTitle>Cloud</CardTitle>
            <CardDescription>
              Handle data transactions to the Cloud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CloudPanel />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="control">
        <Card>
          <CardHeader>
            <CardTitle>Control</CardTitle>
            <CardDescription>
              Hanlde test sequence file management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ControlPanel />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
