import { GalleryData } from "@/renderer/types/gallery";

export const data: GalleryData = {
  Fundamentals: [
    {
      title: "Intro to Loops",
      description: "Generate a random number once",
      imagePath: "assets/appGallery/introToLoops.png",
      appPath: "loop",
      relevantNodes: [
        {
          name: "LOOP",
          docs: "https://docs.flojoy.ai/nodes/LOGIC_GATES/LOOPS/LOOP/",
        },
      ],
      cloudDemoEnabled: true,
    },
    {
      title: "Butterworth Filter",
      description: "Apply a butterworth filter to an input signal",
      imagePath: "assets/appGallery/introToSignals.png",
      appPath: "butterworth",
      relevantNodes: [],
      cloudDemoEnabled: true,
    },
    {
      title: "Intro to Images",
      description: "Apply a butterworth filter on a sample image",
      imagePath: "assets/appGallery/introToImages.png",
      appPath: "images",
      relevantNodes: [
        {
          name: "IMAGE",
          docs: "https://docs.flojoy.ai/nodes/VISUALIZERS/PLOTLY/IMAGE/",
        },
      ],
      cloudDemoEnabled: true,
    },
    // {
    //   title: "Stream to Flojoy Cloud",
    //   description: "Stream data to your Flojoy Cloud account",
    //   imagePath: "assets/appGallery/flojoyCloud.png",
    //   appPath: "cloud",
    //   relevantNodes: [
    //     {
    //       name: "FLOJOY_CLOUD_UPLOAD",
    //       docs: "https://docs.flojoy.ai/nodes/LOADERS/CLOUD_DATABASE/FLOJOY_CLOUD_UPLOAD/",
    //     },
    //   ],
    //   cloudDemoEnabled: false,
    // },
  ],
  AI: [
    {
      title: "Image Captioning",
      description: "Caption any image with this PyTorch ML model",
      imagePath: "assets/appGallery/imageCaptioning.png",
      appPath: "imageCaptioning",
      relevantNodes: [
        {
          name: "NLP_CONNECT_VIT_GPT2",
          docs: "https://docs.flojoy.ai/nodes/AI_ML/IMAGE_CAPTIONING/NLP_CONNECT_VIT_GPT2/",
        },
      ],
      cloudDemoEnabled: true,
    },
    {
      title: "Image Classification",
      description: "Classify any image using Hugging Face Transformers",
      imagePath: "assets/appGallery/imageClassification.png",
      appPath: "imageClassification",
      relevantNodes: [
        {
          name: "HUGGING_FACE_PIPELINE",
          docs: "https://docs.flojoy.ai/nodes/AI_ML/IMAGE_CLASSIFICATION/HUGGING_FACE_PIPELINE/",
        },
      ],
      cloudDemoEnabled: true,
    },
    {
      title: "Time Series Forecasting",
      description: "Predict future events with the Prophet node",
      imagePath: "assets/appGallery/timeSeries.png",
      appPath: "prophet",
      relevantNodes: [
        {
          name: "PROPHET_PREDICT",
          docs: "https://docs.flojoy.ai/nodes/AI_ML/PREDICT_TIME_SERIES/PROPHET_PREDICT/",
        },
      ],
      cloudDemoEnabled: true,
    },
    // {
    //   description: "Estimate object depth with the DINOv2 node",
    //   title: "Depth perception",
    //   imagePath: "assets/appGallery/depthPerception.png",
    //   youtubeLink: "",
    //   relevantNodes: [],
    // },
    // {
    //   title: "Object Identification",
    //   description: "Estimate object depth with the YOLOv3 node",
    //   imagePath: "assets/appGallery/objectIdentification.png",
    //   appPath: "objectDetection",
    //   relevantNodes: [
    //     {
    //       name: "OBJECT_DETECTION",
    //       docs: "https://docs.flojoy.ai/nodes/AI_ML/OBJECT_DETECTION/OBJECT_DETECTION/",
    //     },
    //   ],
    //   cloudDemoEnabled: true,
    // },
  ],
  IO: [
    {
      title: "Arduino",
      description: "Read from any analog sensor",
      imagePath: "assets/appGallery/arduino.png",
      appPath: "arduino",
      relevantNodes: [],
      cloudDemoEnabled: false,
    },
    {
      title: "LabJack",
      description: "Record and log temperatures",
      imagePath: "assets/appGallery/labjack.png",
      appPath: "labjack",
      relevantNodes: [
        {
          name: "LABJACKU3",
          docs: "https://docs.flojoy.ai/nodes/INSTRUMENTS/LABJACK/LABJACKU3/",
        },
      ],
      cloudDemoEnabled: false,
    },
    {
      title: "USB Camera",
      description: "Capture real-time images",
      imagePath: "assets/appGallery/usbCamera.png",
      appPath: "webcam",
      relevantNodes: [
        {
          name: "CAMERA",
          docs: "https://docs.flojoy.ai/nodes/INSTRUMENTS/WEB_CAM/CAMERA/",
        },
      ],
      cloudDemoEnabled: true,
    },
    {
      title: "Stepper Motor",
      description: "Precisely position anything",
      imagePath: "assets/appGallery/stepperMotor.png",
      appPath: "stepper",
      relevantNodes: [
        {
          name: "STEPPER_DRIVER_TIC",
          docs: "https://docs.flojoy.ai/nodes/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC/",
        },
      ],
      cloudDemoEnabled: false,
    },
    {
      title: "Decode I2C",
      description: "Decode I2C messages with an oscilloscope",
      imagePath: "https://res.cloudinary.com/dhopxs1y3/image/upload/v1692118625/Instruments/Oscilloscopes/MSO5000/MSO5000.png",
      appPath: "i2c",
      relevantNodes: [
        {
          name: "DECODE_I2C_MSO2X",
          docs: "https://docs.flojoy.ai/blocks/hardware/oscilloscopes/tektronix/mso2x/decode-i2c-mso2x/",
        },
      ],
      cloudDemoEnabled: false,
    },
    {
      title: "Bode Plot",
      description: "Create a Bode plot with a function generator and an oscilloscope",
      imagePath: "https://res.cloudinary.com/dhopxs1y3/image/upload/v1692118735/Instruments/Function%20Generators/AFG3000/AFG3000.png",
      appPath: "bode",
      relevantNodes: [
        {
          name: "INPUT_PARAM_AFG31000",
          docs: "https://docs.flojoy.ai/blocks/hardware/function-generators/tektronix/afg31000/input-param-afg31000/",
        },
      ],
      cloudDemoEnabled: false,
    },
  ],
  DSP: [
    {
      title: "PID Controller",
      description: "Solve this non-linear dynamic system",
      imagePath: "assets/appGallery/PID.png",
      appPath: "pid",
      relevantNodes: [],
      cloudDemoEnabled: true,
    },
    {
      title: "FIR Filter",
      description: "Apply an FIR filter to an input signal",
      imagePath: "assets/appGallery/FIR.png",
      appPath: "fir",
      relevantNodes: [
        {
          name: "FIR",
          docs: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/FIR/",
        },
      ],
      cloudDemoEnabled: true,
    },
    // {
    //   description: "Solve the Schrödinger with different starting conditions",
    //   title: "Schrödinger equation",
    //   imagePath: "../../../publicassets/appGallery/SchrodingerEqn.png",
    //   youtubeLink: "",
    //   relevantNodes: [
    //   ],
    // },
    {
      title: "FFT",
      description: "Apply a real-time FFT to an input signal",
      imagePath: "assets/appGallery/FFT.png",
      appPath: "fft",
      relevantNodes: [
        {
          name: "FFT",
          docs: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/FFT/",
        },
      ],
      cloudDemoEnabled: true,
    },
    {
      title: "IFFT",
      description: "Transform a signal with the IFFT algorithm",
      imagePath: "assets/appGallery/IFFT.png",
      appPath: "ifft",
      relevantNodes: [
        {
          name: "IFFT",
          docs: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/IFFT/",
        },
      ],
      cloudDemoEnabled: true,
    },
  ],
};

export const getGalleryData = () => {
  return GalleryData.parse(data);
};
