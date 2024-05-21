"use client";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useState } from "react";
import { DeltaStatic } from "quill";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";

export function QuillEditor() {
  const [value, setValue] = useState("");
  const [currentDelta, setCurrentDelta] = useState<DeltaStatic>();
  const toolbarOptions = [
    [{ header: 1 }],
    ["bold"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
  ];

  const saveFromDesktop = async (delta: DeltaStatic) => {
    const docAsBlob = await quillToWord.generateWord(delta as any, {
      exportAs: "blob",
      paragraphStyles: {
        normal: {
          paragraph: {
            spacing: {
              line: 360,
            },
          },
          run: {
            font: "Arial",
            size: 14 * 2,
          },
        },
        header_1: {
          paragraph: {
            spacing: {
              line: 360,
            },
          },
          run: {
            font: "Arial",
            size: 28 * 2,
            bold: true,
          },
        },
        list_paragraph: {
          paragraph: {
            spacing: {
              line: 360,
            },
          },
          run: {
            font: "Arial",
            size: 14 * 2,
          },
        },
      },
    });
    saveAs(docAsBlob as Blob, "document.docx");
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={{
          toolbar: toolbarOptions,
        }}
        value={value}
        onChange={(content, delta, source, editor) => {
          setValue(content);
          setCurrentDelta(editor.getContents());
        }}
      />
      <button>Save</button>
      <button onClick={() => saveFromDesktop(currentDelta as DeltaStatic)}>
        Download from desktop
      </button>
    </div>
  );
}
