import { API_URI } from "@/renderer/data/constants";
import ky from "ky";

// export const baseClient = axios.create({
//   baseURL: API_URI,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export const captain = ky.create({
  prefixUrl: API_URI,
  credentials: "include",
});
