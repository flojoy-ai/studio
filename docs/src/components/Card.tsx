import React from "react";

type CardProps = {
  cardLink: string;
  cardHeader: string;
  cardEmoji: string;
  cardContent: string;
  displayWide: boolean;
};

export default function Card({
  cardLink,
  cardHeader,
  cardEmoji,
  cardContent,
  displayWide,
}: CardProps) {
  let tailwindHeaderSize = "text-2xl";
  let contentStyles = {};

  if (displayWide) {
    tailwindHeaderSize = "text-2l";
    contentStyles = { fontSize: "90%" };
  }

  return (
    <a
      className="flojoy-docs-card flex flex-col gap-2 rounded-2xl border-4 border-modal p-8 text-black transition duration-300 hover:bg-accent2/10 hover:no-underline dark:text-white"
      href={"https://docs.flojoy.ai"}
    >
      <div className={"flex gap-2 font-bold " + tailwindHeaderSize}>
        <div>{cardEmoji}</div>
        <div>{cardHeader}</div>
      </div>
      <p style={contentStyles}>{`${cardContent}`}</p>
    </a>
  );
}
