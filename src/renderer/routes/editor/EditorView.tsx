import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const value = `import os

os.exit("1")
`;

const EditorView = () => {
  return (
    <div className="h-screen">
      <CodeMirror
        value={value}
        height="100%"
        style={{ height: "100%" }}
        className="h-full"
        extensions={[python()]}
        theme={vscodeDark}
      />
    </div>
  );
};

export default EditorView;
