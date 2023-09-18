export type DeviceCardProps = {
  name: string;
  description?: string;
  port: string;
};

export const DeviceCard = ({ name, description, port }: DeviceCardProps) => {
  return (
    <div className="w-64 rounded-md bg-secondary p-2">
      <h3 className="font-semibold text-muted-foreground">{name}</h3>
      <div className="font-semibold">{port}</div>
      <div className="py-1" />
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};
