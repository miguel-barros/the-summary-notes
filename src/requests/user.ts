import api_client from "./api_client";

export const loginRequest = async (email: string, password: string) => {
  try {
    const res = await api_client.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const currentUserRequest = async () => {
  try {
    const res = await api_client.get("/users/me");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
