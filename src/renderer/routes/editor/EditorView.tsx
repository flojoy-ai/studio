import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@src/components/ui/button";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import invariant from "tiny-invariant";

const EditorView = () => {
  const { id } = useParams<{ id: string }>();

  // Joey: https://github.com/remix-run/react-router/issues/8498
  invariant(id, "Error: ID isn't set for the editor view route!");

  const fullPath = atob(id);

  const [value, setValue] = useState("");

  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const loadFile = async () => {
    const res = await window.api.loadFileFromFullPath(fullPath);
    setValue(res);
  };

  const saveFile = async () => {
    const res = await window.api.saveFileToFullPath(fullPath, value);
    if (res.ok) {
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

  return (
    <div>
      <div className="absolute right-5 z-50 flex items-center gap-2 p-4">
        {hasChanged && <div className="">Changed</div>}
        <Button onClick={saveFile}>Save</Button>
        <Button asChild>
          <a href={`vscode://file/${fullPath}`}>Open in VSCode</a>
        </Button>
      </div>
      <CodeMirror
        value={value}
        style={{
          height: `calc(100vh - 48px)`,
        }}
        height="100%"
        className=""
        extensions={[python()]}
        theme={vscodeDark}
        onChange={handleChange}
      />
    </div>
  );
};

export default EditorView;
