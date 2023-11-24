import { useState } from "react"

export const DebugMenuPythonTab = () => {
  const [packagesOutput, setPackagesOutput] = useState<string | undefined>(undefined);
  const [pyvisaOutput, setPyvisaOutput] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.api.listPythonPackages().then((output) => {
      setPackagesOutput(output);
    });
    window.api.pyvisaInfo().then((output) => {
      setPyvisaOutput(output);
    })
  }, [])

  return (
  <div>
      
    </div>
  )
}
