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
  const [editor, setEditor] = useState<EditorInterface | null>(null);
  const editorID = useSearchParams().get("id");
  const hasFetched = useRef(false);

  const handleFetchEditor = useCallback(async () => {
    if (!editorID) return;
    const editors = await editorGetRequest(editorID);
    if (editors) {
      setEditor(editors);
    }
  }, [editorID]);

  const handleExport = () => {
    if (!editor) return;
    const blob = htmlDocx.asBlob(editor.content);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a.remove();
  };

  const handleSave = async (content: string) => {
    if (!editor) return;
    const res = await editorUpdateRequest(editor.id, {
      content,
      updatedAt: new Date().toISOString(),
    });
    if (res) console.log("Saved");
  };

  const handleAutoSave = (content: string) => {
    if (!editor) return;
    if (editor.content === content) return;
    const saveInterval = setTimeout(() => {
      handleSave(content);
    }, 2500);
    return () => clearInterval(saveInterval);
  };

  useEffect(() => {
    if (!hasFetched.current && editorID) {
      hasFetched.current = true;
      handleFetchEditor();
    }
  }, [handleFetchEditor, editorID]);

  return (
    <div>
      <SunEditor
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
        setContents={editor?.content}
        onSave={handleSave}
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
