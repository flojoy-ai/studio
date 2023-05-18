declare module "plotly.js/dist/plotly-flojoyCustomBundle.js" {
  import { Data, Layout, PlotData, PlotType } from "plotly.js";

  // Define the types for the imported module here
  // For example, if you are importing 'Data' and 'Layout', you can define their types:
  export { Data, Layout, PlotData, PlotType };

  // Export other types or modules as needed
  const plotlyModule: any;
  export default plotlyModule;
}
