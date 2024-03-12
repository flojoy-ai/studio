import { Input } from "@/renderer/components/ui/input";
import { InputProps } from "@/renderer/components/ui/input";
import { cn } from "@/renderer/lib/utils";
import { useMemo } from "react";

type NumberInputProps = Omit<InputProps, "value" | "onChange"> & {
  value: number | string;
  precision?: number;
  floating?: boolean;
  onChange?: (e: number | "") => void;
  hideArrows?: boolean;
};

export const NumberInput = ({
  precision,
  value,
  floating,
  hideArrows,
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

  if (floating && precision && typeof val === "number") {
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
    <Input
      type="number"
      value={val}
      onChange={changeHandler}
      {...props}
      className={cn(
        props.className,
        hideArrows
          ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          : "",
      )}
    />
  );
};
