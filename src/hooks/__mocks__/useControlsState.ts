export const useControlsState = jest.fn(() => ({
  ctrlsManifest: [
    {
      type: "input",
      name: "Slider",
      id: "INPUT_PLACEHOLDER",
      hidden: false,
      minHeight: 1,
      minWidth: 2,
    },
  ],
  setCtrlsManifest: jest.fn(),
  gridLayout: [],
  setGridLayout: jest.fn(),
  maxGridLayoutHeight: 0,
}));
