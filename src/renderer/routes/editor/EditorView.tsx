import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@src/components/ui/button";
import { HEADER_HEIGHT } from "../common/Layout";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";

const EditorView = () => {
  const { id } = useParams<{ id: string }>();

  const [value, setValue] = useState("");

  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const loadFile = async () => {
    if (!id) {
      return;
    }
    const res = await window.api.loadFileFromFullPath(atob(id));
    setValue(res);
  };

  const saveFile = async () => {
    if (!id) {
      return;
    }
    const res = await window.api.saveFileToFullPath(atob(id), value);
    if (res) {
      setHasChanged(false);
    }
  };

  const handleChange = (value: string) => {
    setValue(value);
    setHasChanged(true);
  };

  useEffect(() => {
    loadFile();
  }, []);

  useKeyboardShortcut("ctrl", "s", () => saveFile());
  useKeyboardShortcut("meta", "s", () => saveFile());

  if (!id) {
    return <div>Invalid ID</div>;
  }

  return (
    <div
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <div className="absolute right-5 z-50 flex items-center gap-2 p-4">
        {hasChanged && <div className="">Changed</div>}
        <Button onClick={saveFile}>Save</Button>
      </div>
      <CodeMirror
        value={value}
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
        height="100%"
        extensions={[python()]}
        theme={vscodeDark}
        onChange={handleChange}
      />
    </div>
  );
};

export default EditorView;
