import type { TVariant } from "@/types/tailwind";

export const variantClassMap: Record<
  TVariant,
  Record<"stroke" | "fill" | "text" | "shadow" | "border", string>
> = {
  accent1: {
    stroke: "stroke-accent1",
    fill: "fill-accent1",
    text: "text-accent1",
    shadow: "shadow-accent1",
    border: "border-accent1",
  },
  accent2: {
    stroke: "stroke-accent2",
    fill: "fill-accent2",
    text: "text-accent2",
    shadow: "shadow-accent2",
    border: "border-accent2",
  },
  accent3: {
    stroke: "stroke-accent3",
    fill: "fill-accent3",
    text: "text-accent3",
    shadow: "shadow-accent3",
    border: "border-accent3",
  },
  accent4: {
    stroke: "stroke-accent4",
    fill: "fill-accent4",
    text: "text-accent4",
    shadow: "shadow-accent4",
    border: "border-accent4",
  },
  accent5: {
    stroke: "stroke-accent5",
    fill: "fill-accent5",
    text: "text-accent5",
    shadow: "shadow-accent5",
    border: "border-accent5",
  },
  accent6: {
    stroke: "stroke-accent6",
    fill: "fill-accent6",
    text: "text-accent6",
    shadow: "shadow-accent6",
    border: "border-accent6",
  },
};
