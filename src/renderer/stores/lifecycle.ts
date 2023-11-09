import { create } from 'zustand';

export interface CaptainState {
  ready: boolean;
  setReady: (state: boolean) => void;
}
export const useCaptainStateStore = create<CaptainState>((set) => ({
  ready: false,
  setReady: (state: boolean): void => set({ ready: state })
}));
