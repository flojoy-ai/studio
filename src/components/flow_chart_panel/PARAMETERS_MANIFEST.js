import manifests from '../../data/manifests.json'

export const FUNCTION_PARAMETERS = manifests.parameters
// {
//     SINE: {
//         frequency: {type: 'float', default: '1'},
//         offset: {type: 'float', default: '0'},
//         amplitude: {type: 'float', default: '1'},
//         waveform: {type: 'select', options: ["sine", "square", "triangle", "sawtooth"], default: 'sine'},
//     },
//     LINSPACE: {
//         start: {type: 'float', default: '0'},
//         end: {type: 'float', default: '0'},
//         step: {type: 'float', default: '1'},
//     }, 
//     CONSTANT:{
//         constant: {
//             type: 'float', default:'3'
//         }
//     }
// };