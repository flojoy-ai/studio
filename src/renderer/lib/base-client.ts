import { API_URI, isRemote } from "@src/data/constants";
import axios from "axios";

export const baseClient = axios.create({
  baseURL: API_URI,
  withCredentials: !isRemote,
  headers: {
    "Content-Type": "application/json",
  },
});
