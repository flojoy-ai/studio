type NodeLabelProps = {
  label: string;
};

export const NodeLabel = ({ label }: NodeLabelProps) => {
  return (
    <p className="text-center font-sans text-xl font-semibold tracking-wider">
      {label}
    </p>
  );
};
