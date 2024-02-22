import { API_URI } from "@/renderer/data/constants";
import axios from "axios";

export const baseClient = (basicAuth?: `${string}:${string}`) =>
  axios.create({
    baseURL: API_URI,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    },
  });
