import manifests from "../../data/manifests-latest.json";
export const COMMANDS = manifests.commands;

export const SECTIONS = [
  [
    // Simulation tab
    { name: "Generators", key: "GENERATOR" },
  ],
  [
    // Sample data tab
    { name: "Sample data", key: "SAMPLE_DATA" },
  ],
  [
    // ETL tab
    { name: "Extractors", key: "EXTRACTORS" },
    { name: "Transformers", key: "TRANSFORMER" },
    { name: "Loaders", key: "LOADERS" },
  ],
  [
    // AI tab
    { name: "AI", key: "AI" },
  ],
  [
    // DAQ tab
    { name: "DAQ", key: "DAQ" },
  ],
  [
    // Visualization tab
    { name: "Visualization", key: "VISOR" },
  ],
];
