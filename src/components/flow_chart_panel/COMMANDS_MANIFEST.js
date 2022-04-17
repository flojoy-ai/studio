export const COMMANDS = [
    // Generators
    {name: 'Sine Wave', key: 'SINE', type: 'GENERATORS'},
    {name: 'Square Wave', key: 'SQUARE', type: 'GENERATORS'},
    {name: 'Sawtooth', key: 'SAW', type: 'GENERATORS'},
    {name: 'Constant', key: 'CONSTANT', type: 'GENERATORS'},
    {name: 'Linspace', key: 'LINSPACE', type: 'GENERATORS'},
    {name: 'Random (Uniform)', key: 'RAND', type: 'GENERATORS'},

    // Extractors
    {name: 'CSV File', key: 'CSV', type: 'EXTRACTORS'},

    // TRANSFORMERS
    {name: 'Multiply', key: 'MULTIPLY', type: 'TRANSFORMERS'},
    {name: 'Add', key: 'ADD', type: 'TRANSFORMERS'},

    // VISORS
    {name: 'Scatter Plot', key: 'SCATTER', type: 'VISORS'},
    {name: 'Histogram', key: 'HISTOGRAM', type: 'VISORS'},

    // Loaders
    {name: 'CSV file', key: 'CSV_WRITE', type: 'LOADERS'}
]

export const SECTIONS = [
    [
        // Simulation tab
        {name: 'Generators', key: 'GENERATORS'},

    ], [

        // Sample data tab
        {name: 'Sample data', key: 'SAMPLE_DATA'},

    ], [

        // ETL tab
        {name: 'Extractors', key: 'EXTRACTORS'},
        {name: 'Transformers', key: 'TRANSFORMERS'},
        {name: 'Loaders', key: 'LOADERS'},  

    ], [

        // AI tab
        {name: 'AI', key: 'AI'},

    ], [

        // DAQ tab
        {name: 'DAQ', key: 'DAQ'},

    ], [ 

        // Visualization tab
        {name: 'Visualization', key: 'VISORS'},

    ]
];