import * as React from "react";
import { cn } from "@/renderer/lib/utils";
import { Button } from "./button";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allowedExtention?: string[];
}


const filePicker = (allowedExtensions: string[] = []): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    window.api
      .openFilePicker(allowedExtensions)
      .then((result) => {
        if (!result) resolve(null);
        else resolve(result.filePath);
      })
      .catch((error) => {
        console.error("Errors when trying to load file: ", error);
        reject(error);
      });
  });
};


const PathInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange: onChangeProp, disabled, allowedExtention, ...props }, ref) => {
    const [selectedFilePath, setSelectedFilePath] = React.useState<string | null>("");
    const [manualPath, setManualPath] = React.useState<string>("");

    const handleFilePickerClick = async () => {
      const filePath = await filePicker(allowedExtention);
      if (filePath) {
        setSelectedFilePath(filePath);
        setManualPath(filePath);
        if (onChangeProp) {
          onChangeProp({ target: { value: filePath } } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    const handleManualPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setManualPath(event.target.value);
      setSelectedFilePath("");
      if (onChangeProp) {
        onChangeProp(event);
      }
    };

    return (
      <div
        className={cn(
          "flex h-10 w-full rounded-md border bg-background text-sm placeholder:text-muted-foreground disabled:opacity-50 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        )}
      >
      <input
        className={cn(
          "h-9 pl-3 w-full rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        ref={ref}
        // @ts-ignore
        value={selectedFilePath !== "" ? selectedFilePath : manualPath}
        onChange={handleManualPathChange}
        disabled={disabled}
        {...props} 
      /><Button variant={"none"} disabled={disabled} className="h-9 hover:accent-transparent" onClick={handleFilePickerClick}> {"Select"} </Button>
      </div>
    );
  },
);
PathInput.displayName = "Select a path";

export { PathInput };
