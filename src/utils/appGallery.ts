import { AppGalleryElementProps } from "@feature/flow_chart_panel/views/AppGalleryElement";
export interface GalleryData {
  fundamentals: AppGalleryElementProps[];
  "AI/ML": AppGalleryElementProps[];
  "I/O": AppGalleryElementProps[];
  "Digital signal processing & simulation": AppGalleryElementProps[];
}
export const AppGalleryData: GalleryData = {
  fundamentals: [
    {
      linkText: "",
      link: "",
      elementTitle: "",
      imagePath: "",
      youtubeLink: "",
    },
  ],
  "AI/ML": [],
  "I/O": [],
  "Digital signal processing & simulation": [],
};
