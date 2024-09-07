import { env } from "@/env";
import ky from "ky";

export const captain = ky.create({
  prefixUrl: "http://" + env.VITE_BACKEND_HOST + ":" + env.VITE_BACKEND_PORT,
  credentials: "include",
  timeout: 30000,
});
