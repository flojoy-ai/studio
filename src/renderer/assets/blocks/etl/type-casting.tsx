import { memo } from "react";

const nameMapping = {
  MATRIX: "M",
  DATAFRAME: "df",
  DF: "df",
  ORDERED_TRIPLE: "(X Y Z)",
  VECTOR: "V",
  SCALAR: "Scalar",
  BOOLEAN: "Boolean",
  ORDERED_PAIR: "(X Y)",
};

const TypeCastingSvg = ({ blockName }: { blockName: string }) => {
  const [from, to] = blockName.split("_2_");
  const fromName =
    from in nameMapping
      ? nameMapping[from.toUpperCase()]
      : from.replaceAll("_", " ");
  const toName =
    to in nameMapping ? nameMapping[to.toUpperCase()] : to.replaceAll("_", " ");
  return (
    <h2 className="px-3 text-center font-sans text-3xl font-semibold italic tracking-wider text-accent1">{`${fromName} → ${toName}`}</h2>
  );
};

export default memo(TypeCastingSvg);
