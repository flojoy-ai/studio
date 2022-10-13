import manifests from '../../data/manifests.json'
export const COMMANDS = manifests.commands;
// [
//     // Generators
//     {name: 'Sine Wave', key: 'SINE', type: 'GENERATOR'},
//     {name: 'Square Wave', key: 'SQUARE', type: 'GENERATOR'},
//     {name: 'Sawtooth', key: 'SAW', type: 'GENERATOR'},
//     {name: 'Constant', key: 'CONSTANT', type: 'GENERATOR'},
//     {name: 'Linspace', key: 'LINSPACE', type: 'GENERATOR'},
//     {name: 'Random (Uniform)', key: 'RAND', type: 'GENERATOR'},

//     // Extractors
//     {name: 'CSV File', key: 'CSV', type: 'EXTRACTORS'},

//     // TRANSFORMER
//     {name: 'Multiply', key: 'MULTIPLY', type: 'TRANSFORMER'},
//     {name: 'Add', key: 'ADD', type: 'TRANSFORMER'},

//     // VISOR
//     {name: 'Scatter Plot', key: 'SCATTER', type: 'VISOR'},
//     {name: 'Histogram', key: 'HISTOGRAM', type: 'VISOR'},
//     {name: 'Line', key: 'LINE', type: 'VISOR'},
//     {name: '3D Surface Plot', key: 'SURFACE3D', type: 'VISOR'},
//     {name: '3D Scatter Plot', key: 'SCATTER3D', type: 'VISOR'},
//     {name: 'Bar Chart', key: 'BAR', type: 'VISOR'},

//     // Loaders
//     {name: 'CSV file', key: 'CSV_WRITE', type: 'LOADERS'}
// ]

export const SECTIONS = [
    [
        // Simulation tab
        {name: 'Generators', key: 'GENERATOR'},

    ], [

        // Sample data tab
        {name: 'Sample data', key: 'SAMPLE_DATA'},

    ], [

        // ETL tab
        {name: 'Extractors', key: 'EXTRACTORS'},
        {name: 'Transformers', key: 'TRANSFORMER'},
        {name: 'Loaders', key: 'LOADERS'},  

    ], [

        // AI tab
        {name: 'AI', key: 'AI'},

    ], [

        // DAQ tab
        {name: 'DAQ', key: 'DAQ'},

    ], [ 

        // Visualization tab
        {name: 'Visualization', key: 'VISOR'},

    ]
];