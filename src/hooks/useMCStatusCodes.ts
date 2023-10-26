import { atom, useAtom } from "jotai";

export const mcStatusCodes = atom<{ [key: number]: string }>({});

export function useMCStatusCodes() {
  const [statusCodes, setStatusCodes] = useAtom(mcStatusCodes);
  return { statusCodes, setStatusCodes };
}
