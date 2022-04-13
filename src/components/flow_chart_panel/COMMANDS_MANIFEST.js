export const COMMANDS = [
    [
        // Generators
        {name: 'Sine Wave', key: 'SINE', type: 'GENERATOR'},
        {name: 'Square Wave', key: 'SQUARE', type: 'GENERATOR'},
        {name: 'Sawtooth', key: 'SAW', type: 'GENERATOR'},
        {name: 'Constant', key: 'CONSTANT', type: 'GENERATOR'},
        {name: 'Linspace', key: 'LINSPACE', type: 'GENERATOR'},
        {name: 'Random (Uniform)', key: 'RAND', type: 'GENERATOR'},
        // Extractors
        {name: 'CSV File', key: 'CSV', type: 'EXTRACTOR'},
        {name: 'SQLite', key: 'SQLITE', type: 'EXTRACTOR'},
        {name: 'API', key: 'API', type: 'API'},
        {name: 'Website', key: 'WEBSITE', type: 'WEBSITE'},
        // Device Readers
        {name: 'Rasberry Pi', key: 'RPI_READ', type: 'READER'},
        {name: 'LabJack', key: 'LJ_READ', type: 'READER'},
        // Device Commanders
        {name: 'Rasberry Pi', key: 'RPI_CMD', type: 'CMDR'},
        {name: 'LabJack', key: 'LJ_CMD', type: 'CMDR'}   
    ], [
        // TRANSFORMERS
        {name: 'Multiply', key: 'MULTIPLY', type: 'XFRMR'},
        {name: 'Add', key: 'ADD', type: 'XFRMR'}
    ], [
        // Visors
        {name: 'Scatter Plot', key: 'SCATTER', type: 'VISOR'},
        {name: 'Histogram', key: 'HISTOGRAM', type: 'VISOR'},
        // Loaders
        {name: 'CSV file', key: 'CSV_WRITE', type: 'LOADER'}
    ]
]

export const SECTIONS = [
    [
        {name: 'Generators', key: 'GENERATOR'},
        {name: 'Extractors', key: 'EXTRACTOR'},
        {name: 'Device Readers', key: 'READER'},
        {name: 'Device Commanders', key: 'CMDR'}
    ], [
        {name: 'Transformers', key: 'XFRMR'}
    ], [
        {name: 'Visualization Operators', key: 'VISOR'},
        {name: 'Loaders', key: 'LOADER'},        
    ]
];