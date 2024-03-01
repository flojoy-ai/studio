import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Variant =
  | "accent1"
  | "accent2"
  | "accent3"
  | "accent4"
  | "accent5"
  | "accent6";
export const getVariantClass = (variant: Variant) => {
  switch (variant) {
    case "accent1":
      return {
        stroke: "stroke-accent1",
        fill: "fill-accent1",
        text: "text-accent1",
        shadow: "shadow-accent1",
      };
    case "accent2":
      return {
        stroke: "stroke-accent2",
        fill: "fill-accent2",
        text: "text-accent2",
        shadow: "shadow-accent2",
      };
    case "accent3":
      return {
        stroke: "stroke-accent3",
        fill: "fill-accent3",
        text: "text-accent3",
        shadow: "shadow-accent3",
      };
    case "accent4":
      return {
        stroke: "stroke-accent4",
        fill: "fill-accent4",
        text: "text-accent4",
        shadow: "shadow-accent4",
      };
    case "accent5":
      return {
        stroke: "stroke-accent5",
        fill: "fill-accent5",
        text: "text-accent5",
        shadow: "shadow-accent5",
      };
    case "accent6":
      return {
        stroke: "stroke-accent6",
        fill: "fill-accent6",
        text: "text-accent6",
        shadow: "shadow-accent6",
      };
  }
};
