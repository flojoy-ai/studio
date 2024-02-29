import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Variant = "accent2" | "accent3" | "accent4" | "accent-boolean";
export const handleVariant = (variant: Variant) => {
  switch (variant) {
    case "accent2":
      return { stroke: "stroke-accent2", fill: "fill-accent2" };
    case "accent3":
      return { stroke: "stroke-accent3", fill: "fill-accent3" };
  }
};
