import { DeviceCard, DeviceCardProps } from "./DeviceCard";

type DeviceSectionProps = {
  title: string;
  devices?: DeviceCardProps[];
};

export const DeviceSection = ({ title, devices }: DeviceSectionProps) => {
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold text-accent1">{title}</h2>
      {devices ? (
        <div className="flex flex-wrap gap-4">
          {devices.map((device) => (
            <DeviceCard {...device} key={device.port} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">No devices found</div>
      )}
    </div>
  );
};
