import { Input } from "@src/components/ui/input";
import { InputProps } from "@src/components/ui/input";

type NumberInputProps = InputProps & {
  value?: number | "";
  precision?: number;
};

export const NumberInput = ({
  precision,
  value,
  ...props
}: NumberInputProps) => {
  const newValue =
    precision && typeof value === "number"
      ? parseFloat(value.toFixed(precision))
      : value;

  return <Input type="number" value={newValue} {...props} />;
};
