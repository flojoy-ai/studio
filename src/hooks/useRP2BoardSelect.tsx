import { useEffect, useState } from "react";

export const useLoadApp = () => {

  const [directoryHandle, setDirectoryHandle] = useState(null);

  const openDirectorySelector = async () => {
    // Check if the API is supported
    if ('showDirectoryPicker' in window) {
      try {
        const directory = await window.showDirectoryPicker();
        setDirectoryHandle(directory);
      } catch (err) {
        console.error('Error while picking a directory: ', err);
      }
    } else {
      console.error('The File System Access API is not supported in this browser.');
    }
  };

  useEffect(() => {
    const loadDirectory = async () => {
      if (directoryHandle) {
        // TODO: Add logic to handle the directory content
        // You can iterate through the entries in the directory
        // and read the files as needed
      }
    };
    
    loadDirectory();
  }, [directoryHandle]);

  return openDirectorySelector;
};
