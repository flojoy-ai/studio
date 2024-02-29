import { captain } from "@/renderer/lib/ky";

type LogLevel = {
  level: string;
};

export const getLogLevel = async () => {
  const res = (await captain.get("log_level").json()) as LogLevel;
  return res.level;
};

export const setLogLevel = async (level: string) => {
  await captain.post("log_level", { json: { level } });
};
