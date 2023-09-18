import { useHardwareDevices } from "@src/hooks/useHardwareDevices";

export const HardwareInfo = () => {
  const devices = useHardwareDevices();

  if (!devices) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-muted-foreground">Cameras</h2>
      {devices.cameras.length > 0 ? (
        devices.cameras.map((c) => (
          <div>
            <div className="">{c.name}</div>
            <div className="">{c.id}</div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground">No cameras found</div>
      )}
      <div className="py-2" />
      <h2 className="text-lg font-bold text-muted-foreground">Serial</h2>
      {devices.serialDevices.length > 0 ? (
        devices.serialDevices.map((s) => (
          <div>
            <div className="font-semibold">
              {s.port}{" "}
              <span className="font-normal text-muted-foreground">
                ({s.hwid})
              </span>
            </div>
            <div className="text-muted-foreground">{s.description}</div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground">No serial devices found</div>
      )}
    </div>
  );
};
