export type DeviceCardProps = {
  name: string;
  description?: string;
  manufacturer?: string;
  port?: string;
};

export const DeviceCard = ({
  name,
  description,
  manufacturer,
  port,
}: DeviceCardProps) => {
  return (
    <div className="w-72 rounded-md bg-secondary p-2">
      <h3 className="font-semibold text-muted-foreground">{name}</h3>
      {port && <div className="max-w-fit break-all font-semibold">{port}</div>}
      {manufacturer && (
        <div className="mt-2 text-sm text-muted-foreground">{manufacturer}</div>
      )}
      <div className="py-1" />
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};
