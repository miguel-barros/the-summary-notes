import api_client from "./api_client";

type EditorUpdateRequest = Partial<EditorInterface>;

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

export const editorGetRequest = async (id: string) => {
  try {
    const response = await api_client.get<EditorInterface>(`/editor/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const editorGetAllRequest = async () => {
  try {
    const response = await api_client.get<EditorInterface[]>("/editor");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
