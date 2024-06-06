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
      Editores
      <div className="flex flex-col gap-3 w-6/12">
        {editors?.map((editor) => (
          <div
            key={editor.id}
            className="flex justify-center items-center flex-col p-2 rounded-md border-red-500 bg-red-500"
          >
            <p>
              Ultima edição:{" "}
              {new Date(editor.updatedAt).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
            <button
              onClick={() => {
                router.push(`/editor?id=${editor.id}`);
              }}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
