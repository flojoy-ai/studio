import mixpanel from "mixpanel-browser";
const PROJECT_TOKEN = "e89f03371825eaccda13079d584bff8e";
export const frontEndLoads = () => {
  try {
    mixpanel.init(PROJECT_TOKEN, {
      debug: true,
      loaded: function () {
        mixpanel.track("Flojoy Loaded");
      },
    });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
export const nodeDeleted = (node: string) => {
  try {
    mixpanel.track("Node Deleted", { nodeTitle: node });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

export const nodeAdded = (node: string) => {
  try {
    mixpanel.track("Node Added", { nodeTitle: node });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

export const tabChanged = (changedTab: string) => {
  try {
    mixpanel.track("Tab Changed", { tab: changedTab });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
export const nodeSearched = (node: string) => {
  try {
    mixpanel.track("Node Searched", { nodeTitle: node });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
