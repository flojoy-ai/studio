import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useEffect, useState } from "react";
import axios from "axios";
import { EnvironmentDetail } from "../types/environment";
import PackageEntry from "./PackageEntry";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";

const PythonPackageList = () => {
  const { currentPythonEnv } = useFlowChartState();
  const [packageList, setPackageList] = useState<string[]>([]);

  const fetchPackageList = async () => {
    if (currentPythonEnv) {
      const data = await axios.get(
        `http://localhost:5392/pymgr/env/${btoa(currentPythonEnv)}`,
      );

      const parsedData = await EnvironmentDetail.safeParseAsync(data.data);

      if (parsedData.success) {
        setPackageList(parsedData.data.dependencies || []);
      } else {
        console.error(parsedData.error);
      }
    }
  };

  useEffect(() => {
    fetchPackageList();
  }, [currentPythonEnv]);

  return (
    <div>
      <div className="text-lg font-semibold">Package List</div>

      <div className="py-2" />
      {currentPythonEnv ? (
        <div>
          {packageList.length === 0 ? (
            <div>No packages installed</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Package</TableHead>
                  <TableHead className="">Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packageList.map((pkg) => {
                  return (
                    <PackageEntry
                      name={pkg.split("=")[0]}
                      version={pkg.split("=")[1]}
                    />
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        <div>Please select a Python environment </div>
      )}
    </div>
  );
};

export default PythonPackageList;
