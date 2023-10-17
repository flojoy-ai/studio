import { BrowserWindow } from "electron";
import { join } from "path";
type BrandingWindow = {
  icon: string;
  electronDir: string;
};
export const brandingWindow = ({ icon, electronDir }: BrandingWindow) => {
  const win = new BrowserWindow({
    height: 393,
    width: 650,
    maximizable: false,
    icon,
    center: true,
    closable: false,
  });
  const html = join(electronDir, "branding.html");
  return new Promise((resolve) => {
    win
      .loadFile(html)
      .then(() => {
        win.show();
        setTimeout(() => {
          resolve(true);
          win.close();
        }, 5000);
      })
      .catch(() => {
        resolve(true);
        win.close();
      });
  });
};
