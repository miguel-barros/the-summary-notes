"use client";
import "suneditor/dist/css/suneditor.min.css";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import htmlDocx from "html-docx-js/dist/html-docx";
import { useSearchParams } from "next/navigation";
import { editorGetRequest, editorUpdateRequest } from "@/requests/editor";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export function TextEditor() {
  const [editor, setEditor] = useState<EditorInterface>({
    id: "",
    content: "",
    title: "",
    updatedAt: "",
    createdAt: "",
    userId: "",
  });
  const [readOnly, setReadOnly] = useState(true);
  const editorID = useSearchParams().get("id");
  const hasFetched = useRef(false);

  const handleFetchEditor = useCallback(async () => {
    if (!editorID) return;
    const editor = await editorGetRequest(editorID);
    if (editor) {
      setEditor(editor);
    }
  }, [editorID]);

  const handleExport = () => {
    if (!editor) return;
    const blob = htmlDocx.asBlob(`
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
          </head>
        <body>
          ${editor.content}
        </body>
      </html>
    `);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editor.title}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = useCallback(
    async (content: string, title: string) => {
      if (!editor || !content || !title) return;
      const res = await editorUpdateRequest(editor.id, {
        content,
        updatedAt: new Date().toISOString(),
        title,
      });
      if (res) console.log("Auto saved");
    },
    [editor]
  );

  const handleAutoSave = (content: string) => {
    if (!editor || !editor.title) return;
    if (editor.content === content) return;
    const saveInterval = setTimeout(() => {
      handleSave(content, editor.title);
    }, 1500);
    return () => clearInterval(saveInterval);
  };

  useEffect(() => {
    if (!hasFetched.current && editorID) {
      hasFetched.current = true;
      handleFetchEditor();
    }
    return () => {
      hasFetched.current = false;
    };
  }, [handleFetchEditor, editorID]);

  return (
    <div className="flex flex-col gap-2">
      <button
        className="self-end"
        onClick={() => {
          setReadOnly(!readOnly);
        }}
      >
        {readOnly ? "Edit" : "Read only"}
      </button>
      <input
        type="text"
        value={editor.title}
        disabled={readOnly}
        onChange={(e) => {
          if (!editor || readOnly) return;
          setEditor({ ...editor, title: e.target.value });
        }}
        onBlur={() => {
          if (!editor || readOnly) return;
          handleSave(editor.content, editor.title);
        }}
        placeholder="Summary title"
        className="self-center text-xl"
      />
      <SunEditor
        setDefaultStyle={
          readOnly ? "border: 0; padding: 0;" : "border: 1px solid #dadada;"
        }
        setOptions={{
          mode: "classic",
          font: ["Arial"],
          formats: ["h1", "h2", "h3", "p", "blockquote", "pre"],
          fontSize: [12, 14, 16, 18, 20, 24, 28, 32, 36],
          resizingBar: false,
          buttonList: [
            ["font", "fontSize", "formatBlock"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["removeFormat"],
            ["fontColor", "hiliteColor"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "table"],
            ["link", "image", "video"],
            ["undo", "redo"],
          ],
        }}
        readOnly={readOnly}
        setContents={editor.content}
        disable={readOnly}
        disableToolbar={readOnly}
        hideToolbar={readOnly}
        onChange={(content) => {
          if (!editor) return;
          setEditor({ ...editor, content });
          handleAutoSave(content);
        }}
      />
      <button onClick={handleExport}>Save to desktop</button>
    </div>
  );
}
