import * as React from "react";
import { cn } from "@/renderer/lib/utils";
import { Button } from "./button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allowedExtention?: string[];
  allowDirectoryCreation?: boolean;
  pickerType?: "file" | "directory";
}

const filePicker = (
  allowedExtensions: string[] = [],
): Promise<string | null> => {
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

const directoryPicker = (
  allowDirectoryCreation: boolean = false,
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    window.api
      .pickDirectory(allowDirectoryCreation)
      .then((result) => {
        if (!result) resolve(null);
        else resolve(result);
      })
      .catch((error) => {
        console.error("Errors when trying to load file: ", error);
        reject(error);
      });
  });
};

const PathInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      onChange: onChangeProp,
      disabled,
      allowedExtention,
      allowDirectoryCreation,
      pickerType,
      ...props
    },
    ref,
  ) => {
    const [selectedFilePath, setSelectedFilePath] = React.useState<
      string | null
    >("");
    const [manualPath, setManualPath] = React.useState<string>("");

    const handlePickerClick = async () => {
      const path =
        pickerType === "directory"
          ? await directoryPicker(allowDirectoryCreation)
          : await filePicker(allowedExtention);
      if (path) {
        setSelectedFilePath(path);
        setManualPath(path);
        if (onChangeProp) {
          onChangeProp({
            target: { value: path },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    const handleManualPathChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setManualPath(event.target.value);
      setSelectedFilePath("");
      if (onChangeProp) {
        onChangeProp(event);
      }
    };

    return (
      <div
        className={cn(
          "flex inline-flex h-10 w-full items-center justify-center rounded-md rounded-md border bg-background text-sm text-sm font-medium ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:opacity-50",
        )}
      >
        <input
          className={cn(
            "h-9 w-full rounded-md bg-background pl-3 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
          ref={ref}
          value={selectedFilePath ?? manualPath}
          onChange={handleManualPathChange}
          disabled={disabled}
          {...props}
        />
        <Button
          variant={"none"}
          disabled={disabled}
          className="h-9 hover:accent-transparent"
          onClick={handlePickerClick}
        >
          {" "}
          {"Select"}{" "}
        </Button>
      </div>
    );
  },
);
PathInput.displayName = "Select a path";

export { PathInput };
