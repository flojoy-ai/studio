import { Input } from "@src/components/ui/input";
import { InputProps } from "@src/components/ui/input";
import { useMemo } from "react";

type NumberInputProps = Omit<InputProps, "value" | "onChange"> & {
  value: number | string;
  precision?: number;
  floating?: boolean;
  onChange?: (e: number | "") => void;
};

export const NumberInput = ({
  precision,
  value,
  floating,
  onChange,
  ...props
}: NumberInputProps) => {
  const parseFunc = useMemo(
    () => (floating ? parseFloat : parseInt),
    [floating],
  );

  let val =
    value === "" || typeof value === "number"
      ? value
      : parseFunc(value as string);

  if (precision && typeof val === "number") {
    val = parseFloat(val.toFixed(precision));
  }

  const changeHandler = (e) => {
    if (!onChange) return;

    const newValue = e.target.value;
    if (newValue === "") {
      onChange("");
      return;
    }

    onChange(parseFunc(newValue));
  };

  return (
    <Input type="number" value={val} onChange={changeHandler} {...props} />
  );
};
