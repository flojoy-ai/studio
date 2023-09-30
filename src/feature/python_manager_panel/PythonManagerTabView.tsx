import { Separator } from "@/components/ui/separator";
import PythonEnvSelector from "./components/PythonEnvSelector";
import PythonPackageList from "./components/PythonPackageList";

const PythonManagerTabView = () => {
  return (
    <div className="container">
      <div className="py-4" />
      <PythonEnvSelector />

      <div className="py-1" />
      <Separator />
      <div className="py-1" />

      <PythonPackageList />
    </div>
  );
};

export default PythonManagerTabView;
