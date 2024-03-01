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
import { TestGeneratorPanel } from "./panels/TestGeneratorPanel/TestGeneratorPanel";

export function TabsDemo() {
  return (
    <Tabs defaultValue="control" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="control">Control Panel</TabsTrigger>
        <TabsTrigger value="cloud">Cloud Panel</TabsTrigger>
        <TabsTrigger value="generate">Generate Panel</TabsTrigger>
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
              Handle test sequence file management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ControlPanel />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="generate">
        <Card>
          <CardHeader>
            <CardTitle>Generate</CardTitle>
            <CardDescription>Generate tests using AI</CardDescription>
          </CardHeader>
          <CardContent>
            <TestGeneratorPanel />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
