import { AppGalleryElementProps } from "@feature/flow_chart_panel/views/AppGalleryElement";

type AppGalleryData = Omit<AppGalleryElementProps, "setIsGalleryOpen">;

export interface GalleryData {
  fundamentals: AppGalleryData[];
  AI: AppGalleryData[];
  IO: AppGalleryData[];
  DSP: AppGalleryData[];
}
export const AppGalleryData: GalleryData = {
  fundamentals: [
    {
      linkText: "Generate a random number once",
      link: "https://docs.flojoy.ai/nodes/LOGIC_GATES/LOOPS/LOOP/",
      elementTitle: "Intro to LOOPS",
      imagePath: "../../assets/appGallery/introToLoops.png",
      youtubeLink: "",
      appPath: "randomNumber",
    },
    {
      linkText: "Generate waveforms of different shapes",
      link: "https://www.google.ca",
      elementTitle: "Intro to signals",
      imagePath: "../../assets/appGallery/introToSignals.png",
      youtubeLink: "",
      appPath: "oscilator",
    },
    {
      linkText: "Apply a butterworth filter on a sample image",
      link: "https://www.google.ca",
      elementTitle: "Intro to images",
      imagePath: "../../../public/assets/appGallery/introToImages.png",
      youtubeLink: "",
      appPath: "butterworth",
    },
    {
      linkText: "Stream data to your Flojoy Cloud account",
      link: "https://docs.flojoy.ai/nodes/LOADERS/CLOUD_DATABASE/LOADER/",
      elementTitle: "Stream to Flojoy Cloud",
      imagePath: "../../../public/assets/appGallery/flojoyCloud.png",
      youtubeLink: "",
      appPath: "cloud",
    },
  ],
  AI: [
    {
      linkText: "Caption any image with this PyTorch ML model",
      link: "https://docs.flojoy.ai/nodes/AI_ML/IMAGE_CAPTIONING/NLP_CONNECT_VIT_GPT2/",
      elementTitle: "Image captioning",
      imagePath: "../../../public/assets/appGallery/imageCaptioning.png",
      youtubeLink: "",
      appPath: "imageCaptioning",
    },
    {
      linkText: "Predict future events with the Prophet node",
      link: "https://docs.flojoy.ai/nodes/AI_ML/PREDICT_TIME_SERIES/PROPHET_PREDICT/",
      elementTitle: "Time series forecasting",
      imagePath: "../../../public/assets/appGallery/timeSeries.png",
      youtubeLink: "",
      appPath: "prophet",
    },
    {
      linkText: "Estimate object depth with the DINOv2 node",
      link: "https://www.google.ca",
      elementTitle: "Depth perception",
      imagePath: "../../../public/assets/appGallery/depthPerception.png",
      youtubeLink: "",
    },
    {
      linkText: "Estimate object depth with the YOLOv3 node",
      link: "https://docs.flojoy.ai/nodes/AI_ML/OBJECT_DETECTION/OBJECT_DETECTION/",
      elementTitle: "Object identification",
      imagePath: "../../../public/assets/appGallery/objectIdentification.png",
      youtubeLink: "",
      appPath: "objectDetection",
    },
  ],
  IO: [
    {
      linkText: "Read from any analog sensor",
      link: "https://www.google.ca",
      elementTitle: "Arduino",
      imagePath: "../../../public/assets/appGallery/arduino.png",
      youtubeLink: "",
      appPath: "arduino",
    },
    {
      linkText: "Record and log temperatures",
      link: "https://docs.flojoy.ai/nodes/INSTRUMENTS/LABJACK/LABJACKU3/",
      elementTitle: "LabJack",
      imagePath: "../../../public/assets/appGallery/labjack.png",
      youtubeLink: "",
      appPath: "labjack",
    },
    {
      linkText: "Capture real-time images",
      link: "https://docs.flojoy.ai/nodes/INSTRUMENTS/WEB_CAM/CAMERA/",
      elementTitle: "USB camera",
      imagePath: "../../../public/assets/appGallery/usbCamera.png",
      youtubeLink: "",
      appPath: "webcam",
    },
    {
      linkText: "Precisely position anything",
      link: "https://docs.flojoy.ai/nodes/INSTRUMENTS/STEPPER_MOTOR/STEPPER_DRIVER_TIC/",
      elementTitle: "Stepper motor",
      imagePath: "../../../public/assets/appGallery/stepperMotor.png",
      youtubeLink: "",
      appPath: "stepper",
    },
  ],
  DSP: [
    {
      linkText: "Solve this non-linear dynamic system",
      link: "https://www.google.ca",
      elementTitle: "PID controller",
      imagePath: "../../../public/assets/appGallery/PID.png",
      youtubeLink: "",
      appPath: "pid",
    },
    {
      linkText: "Apply an FIR filter to an input signal",
      link: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/FIR/",
      elementTitle: "FIR filter",
      imagePath: "../../../public/assets/appGallery/FIR.png",
      youtubeLink: "",
      appPath: "fir",
    },
    {
      linkText: "Solve the Schrödinger with different starting conditions",
      link: "https://www.google.ca",
      elementTitle: "Schrödinger equation",
      imagePath: "../../../public/assets/appGallery/SchrodingerEqn.png",
      youtubeLink: "",
    },
    {
      linkText: "Apply a real-time FFT to an input signal",
      link: "https://docs.flojoy.ai/nodes/TRANSFORMERS/SIGNAL_PROCESSING/FFT/",
      elementTitle: "FFT",
      imagePath: "../../../public/assets/appGallery/FFT.png",
      youtubeLink: "",
      appPath: "fft",
    },
  ],
};
