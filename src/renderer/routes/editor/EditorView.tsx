import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EditorView = () => {
  const { id } = useParams<{ id: string }>();

  const [value, setValue] = useState("");

  const loadFile = async () => {
    if (!id) {
      return;
    }
    const res = await window.api.loadFileFromFullPath(atob(id));
    setValue(res);
  };

  // const saveFile=async () => {
  //
  // }

  useEffect(() => {
    loadFile();
  }, []);

  if (!id) {
    return <div>Invalid ID</div>;
  }

  return (
    <div className="h-screen">
      <div>{atob(id)}</div>
      <CodeMirror
        value={value}
        height="100%"
        style={{ height: "100%" }}
        className="h-full"
        extensions={[python()]}
        theme={vscodeDark}
        onChange={setValue}
      />
    </div>
  );
};

export default EditorView;
