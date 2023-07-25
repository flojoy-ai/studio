import { AppGalleryElementProps } from "@feature/flow_chart_panel/views/AppGalleryElement";
export interface GalleryData {
  fundamentals: AppGalleryElementProps[];
  AI: AppGalleryElementProps[];
  IO: AppGalleryElementProps[];
  DSP: AppGalleryElementProps[];
}
export const AppGalleryData: GalleryData = {
  fundamentals: [
    {
      linkText: "Generate a random number once",
      link: "https://www.google.ca",
      elementTitle: "Intro to LOOPS",
      imagePath: "../../../public/assets/appGallery/introToLoops.png",
      youtubeLink: "",
      appPath: "randomNumber",
    },
    {
      linkText: "Generate waveforms of different shapes",
      link: "https://www.google.ca",
      elementTitle: "Intro to signals",
      imagePath: "../../../public/assets/appGallery/introToSignals.png",
      youtubeLink: "",
      appPath: "oscilator"
    },
    {
      linkText: "Apply a butterworth filter on a sample image",
      link: "https://www.google.ca",
      elementTitle: "Intro to images",
      imagePath: "../../../public/assets/appGallery/introToImages.png",
      youtubeLink: "",
      appPath: "butterworth"

    },
    {
      linkText: "Stream data to your Flojoy Cloud account",
      link: "https://www.google.ca",
      elementTitle: "Stream to Flojoy Cloud",
      imagePath: "../../../public/assets/appGallery/flojoyCloud.png",
      youtubeLink: "",
      //appPath: "cloud"
    },
  ],
  AI: [
    {
      linkText: "Caption any image with this PyTorch ML model",
      link: "https://www.google.ca",
      elementTitle: "Image captioning",
      imagePath: "../../../public/assets/appGallery/imageCaptioning.png",
      youtubeLink: "",
      appPath: "imageCaptioning"
    },
    {
      linkText: "Predict future events with the Prophet node",
      link: "https://www.google.ca",
      elementTitle: "Time series forecasting",
      imagePath: "../../../public/assets/appGallery/timeSeries.png",
      youtubeLink: "",
      appPath: "prophet"
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
      link: "https://www.google.ca",
      elementTitle: "Object identification",
      imagePath: "../../../public/assets/appGallery/objectIdentification.png",
      youtubeLink: "",
      appPath: "objectDetection"
    },
  ],
  IO: [
    {
      linkText: "Read from any analog sensor",
      link: "https://www.google.ca",
      elementTitle: "Arduino",
      imagePath: "../../../public/assets/appGallery/arduino.png",
      youtubeLink: "",
    },
    {
      linkText: "Record and log temperatures",
      link: "https://www.google.ca",
      elementTitle: "LabJack",
      imagePath: "../../../public/assets/appGallery/labjack.png",
      youtubeLink: "",
    },
    {
      linkText: "Capture real-time images",
      link: "https://www.google.ca",
      elementTitle: "USB camera",
      imagePath: "../../../public/assets/appGallery/usbCamera.png",
      youtubeLink: "",
    },
    {
      linkText: "Precisely position anything",
      link: "https://www.google.ca",
      elementTitle: "Stepper motor",
      imagePath: "../../../public/assets/appGallery/stepperMotor.png",
      youtubeLink: "",
    },
  ],
  DSP: [
    {
      linkText: "Solve this non-linear dynamic system",
      link: "https://www.google.ca",
      elementTitle: "PID controller",
      imagePath: "../../../public/assets/appGallery/PID.png",
      youtubeLink: "",
    },
    {
      linkText: "Apply an FIR filter to an input signal",
      link: "https://www.google.ca",
      elementTitle: "FIR filter",
      imagePath: "../../../public/assets/appGallery/FIR.png",
      youtubeLink: "",
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
      link: "https://www.google.ca",
      elementTitle: "FFT",
      imagePath: "../../../public/assets/appGallery/FFT.png",
      youtubeLink: "",
      appPath: "fft",
    },
  ],
};
