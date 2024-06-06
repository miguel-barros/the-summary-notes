import api_client from "./api_client";

type EditorUpdateRequest = Pick<EditorInterface, "content">;

export const editorUpdateRequest = async (
  id: string,
  data: EditorUpdateRequest
) => {
  try {
    const response = await api_client.patch(`/editor/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const editorGetRequest = async (id?: string) => {
  try {
    const response = await api_client.get<EditorInterface[]>(
      `/editor${id ? `/${id}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
