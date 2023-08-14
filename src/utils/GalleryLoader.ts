import { GalleryData } from "@src/types/gallery";

const data: GalleryData = {
  Fundamentals: [
    {
      title: "Intro to LOOPS",
      description: "Generate a random number once",
      imagePath: "/assets/appGallery/introToLoops.png",
      appPath: "randomNumber",
      relevantNodes: [
        {
          name: "LOOP",
          docs: "https://docs.flojoy.ai/nodes/LOGIC_GATES/LOOPS/LOOP/",
        },
      ],
    },
    {
      title: "Intro to signals",
      description: "Generate waveforms of different shapes",
      imagePath: "/assets/appGallery/introToSignals.png",
      appPath: "oscilator",
      relevantNodes: [],
    },
    {
      title: "Intro to images",
      description: "Apply a butterworth filter on a sample image",
      imagePath: "/assets/appGallery/introToImages.png",
      appPath: "images",
      relevantNodes: [
        {
          name: "IMAGE",
          docs: "https://docs.flojoy.ai/nodes/VISUALIZERS/PLOTLY/IMAGE/"
        }
      ],
    },
    {
      title: "Stream to Flojoy Cloud",
      description: "Stream data to your Flojoy Cloud account",
      imagePath: "/assets/appGallery/flojoyCloud.png",
      appPath: "cloud",
      relevantNodes: [
        {
          name: "LOADER",
          docs: "https://docs.flojoy.ai/nodes/LOADERS/CLOUD_DATABASE/LOADER/",
        },
      ],
    },
  ],
  AI: [
    {
      title: "Image captioning",
      description: "Caption any image with this PyTorch ML model",
      imagePath: "/assets/appGallery/imageCaptioning.png",
      appPath: "imageCaptioning",
      relevantNodes: [
        {
          name: "NLP_CONNECT_VIT_GPT2",
          docs: "https://docs.flojoy.ai/nodes/AI_ML/IMAGE_CAPTIONING/NLP_CONNECT_VIT_GPT2/",
        },
      ],
    },
    {
      description: "Predict future events with the Prophet node",
      title: "Time series forecasting",
      imagePath: "/assets/appGallery/timeSeries.png",
      appPath: "prophet",
      relevantNodes: [
        {
          name: "PROPHET_PREDICT",
          docs: "https://docs.flojoy.ai/nodes/AI_ML/PREDICT_TIME_SERIES/PROPHET_PREDICT/",
        },
      ],
    },
    // {
    //   description: "Estimate object depth with the DINOv2 node",
    //   title: "Depth perception",
    //   imagePath: "../../../public/assets/appGallery/depthPerception.png",
    //   youtubeLink: "",
    //   relevantNodes: [],
    // },
    {
      description: "Estimate object depth with the YOLOv3 node",
      title: "Object identification",
      imagePath: "/assets/appGallery/objectIdentification.png",
      appPath: "objectDetection",
      relevantNodes: [
        {
          name: "OBJECT_DETECTION",
          docs: "https://docs.flojoy.ai/nodes/AI_ML/OBJECT_DETECTION/OBJECT_DETECTION/",
        },
      ],
    },
  ],
  IO: [
    {
      description: "Read from any analog sensor",
      title: "Arduino",
      imagePath: "/assets/appGallery/arduino.png",
      appPath: "arduino",
      relevantNodes: [],
    },
    {
      description: "Record and log temperatures",
      title: "LabJack",
      imagePath: "/assets/appGallery/labjack.png",
      appPath: "labjack",
      relevantNodes: [
        {
          name: "LABJACKU3",
          docs: "https://docs.flojoy.ai/nodes/INSTRUMENTS/LABJACK/LABJACKU3/",
        },
      ],
    },
    {
      description: "Capture real-time images",
      title: "USB camera",
      imagePath: "/assets/appGallery/usbCamera.png",
      appPath: "webcam",
      relevantNodes: [
        {
          name: "CAMERA",
          docs: "https://docs.flojoy.ai/nodes/INSTRUMENTS/WEB_CAM/CAMERA/",
        },
      ],
    },
    {
      description: "Precisely position anything",
      title: "Stepper motor",
      imagePath: "/assets/appGallery/stepperMotor.png",
      appPath: "stepper",
      relevantNodes: [
        {
          name: "STEPPER_DRIVER_TIC",
          docs: "https://docs.flojoy.ai/nodes/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC/",
        },
      ],
    },
  ],
  DSP: [
    {
      description: "Solve this non-linear dynamic system",
      title: "PID controller",
      imagePath: "/assets/appGallery/PID.png",
      appPath: "pid",
      relevantNodes: [],
    },
    {
      description: "Apply an FIR filter to an input signal",
      title: "FIR filter",
      imagePath: "/assets/appGallery/FIR.png",
      appPath: "fir",
      relevantNodes: [
        {
          name: "FIR",
          docs: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/FIR/",
        },
      ],
    },
    // {
    //   description: "Solve the Schrödinger with different starting conditions",
    //   title: "Schrödinger equation",
    //   imagePath: "../../../public/assets/appGallery/SchrodingerEqn.png",
    //   youtubeLink: "",
    //   relevantNodes: [
    //   ],
    // },
    {
      description: "Apply a real-time FFT to an input signal",
      title: "FFT",
      imagePath: "/assets/appGallery/FFT.png",
      appPath: "fft",
      relevantNodes: [
        {
          name: "FFT",
          docs: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/FFT/",
        },
      ],
    },
  ],
};

export const getGalleryData = () => {
  return GalleryData.parse(data);
};
