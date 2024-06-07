"use client";
import { editorGetAllRequest } from "@/requests/editor";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const [editors, setEditors] = useState<EditorInterface[] | null>([]);
  const hasFetched = useRef(false);
  const router = useRouter();

  const fetchEditors = useCallback(async () => {
    const data = await editorGetAllRequest();
    if (!data) return;
    setEditors(data);
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchEditors();
    }
  }, [fetchEditors]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl">My summaries</h1>
      <div className="flex flex-col gap-3">
        {editors?.map((editor) => (
          <div
            key={editor.id}
            className="flex justify-center flex-col p-2 rounded-md"
          >
            <p className="text-lg">
              <strong>Summary title:</strong> {editor.title}
            </p>
            <p className="text-lg">
              <strong>Last updated:</strong>{" "}
              {new Date(editor.updatedAt).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
            <button
              className="text-lg"
              onClick={() => {
                router.push(`/editor?id=${editor.id}`);
              }}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
