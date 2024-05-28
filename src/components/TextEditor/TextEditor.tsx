"use client";
import "suneditor/dist/css/suneditor.min.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import htmlDocx from "html-docx-js/dist/html-docx";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export function TextEditor() {
  const [content, setContent] = useState("");

  const handleExport = () => {
    const blob = htmlDocx.asBlob(content);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
            ["save"],
          ],
        }}
        onSave={(content) => console.log(content)}
        onChange={setContent}
      />
      <button onClick={handleExport}>Save to desktop</button>
    </div>
  );
}
