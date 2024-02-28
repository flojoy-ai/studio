import { atom } from "jotai";

// TODO: Move/get rid of these
export const showWelcomeScreenAtom = atom<boolean>(true);

export const centerPositionAtom = atom<{ x: number; y: number }>({
  x: 0,
  y: 0,
});
