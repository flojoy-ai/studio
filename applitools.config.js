// This config file specifies how to run visual tests with Applitools.
// It applies to all tests in this project.

module.exports = {
  // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
  // Warning: If you have a free account, then concurrency will be limited to 1.
  testConcurrency: 10,

  // To connect visual test results to your account,
  // you must set the `APPLITOOLS_API_KEY` environment variable to your Applitools API key.
  // To find it: https://applitools.com/tutorials/getting-started/setting-up-your-environment.html
  // If you don't explicitly set the API key here,
  // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
  apiKey: "APPLITOOLS_API_KEY",

  // A batch is the collection of visual checkpoints for a test suite.
  // Batches are displayed in the Eyes Test Manager, so use meaningful names.
  batchName: "Flojoy Studio",
  batchId: process.env.APPLITOOLS_BATCH_ID,

  // Applitools can run checkpoints for snapshots against any browser in the Ultrafast Grid.
  // This setting defines 5 unique browser configurations to test.
  browser: [
    // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
    // Other browsers are also available, like Edge and IE.
    { width: 1600, height: 1200, name: "chrome" },
    { width: 1600, height: 1200, name: "firefox" },
    { width: 1600, height: 1200, name: "safari" },
  ],

  failCypressOnDiff: false,
};
