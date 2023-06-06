const CMND_TREE = {
  title: "ROOT",
  children: [],
};

const getManifestCmdsMap = jest.fn(() => ({}));
const getManifestCmds = jest.fn(() => [
  {
    key: "test-key",
    name: "node-1",
    type: "SIMULATION",
  },
]);
const getManifestParams = jest.fn(() => ({
  SINE: {
    frequency: {
      default: 10,
      type: "float",
    },
  },
}));

export { CMND_TREE, getManifestCmds, getManifestCmdsMap, getManifestParams };
