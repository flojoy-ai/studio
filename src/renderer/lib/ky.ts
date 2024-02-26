import { API_URI } from "@/renderer/data/constants";
import ky from "ky";

export const captain = ky.create({
  prefixUrl: API_URI,
  credentials: "include",
});
