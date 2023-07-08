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
      imagePath: "../../../public/assets/appGallery/8.png",
      youtubeLink: "",
    },
  ],
  AI: [
    {
      linkText: "AI STUFF",
      link: "https://www.google.ca",
      elementTitle: "Intro to ai",
      imagePath: "",
      youtubeLink: "",
    },
  ],
  IO: [
    {
      linkText: "IO STUFF",
      link: "https://www.google.ca",
      elementTitle: "Intro to IO",
      imagePath: "",
      youtubeLink: "",
    },
  ],
  DSP: [
    {
      linkText: "DSP STUFF",
      link: "https://www.google.ca",
      elementTitle: "dsp stuff",
      imagePath: "",
      youtubeLink: "",
    },
  ],
};
