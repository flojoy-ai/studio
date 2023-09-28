import { HardwareInfo } from "./components/HardwareInfo";
import { Layout } from "../common/Layout";

const DeviceView = () => {
  return (
    <Layout>
      <div className="p-12">
        <HardwareInfo />
      </div>
    </Layout>
  );
};

export default DeviceView;
