import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

const extractError = (error) => {
  if (error.response?.data) {
    const d = error.response.data;
    return d.message || d.error || d.errors?.[0]?.msg || "Request failed";
  }
  if (error.request) return "Server is unreachable. Please try again later.";
  return "An unexpected error occurred";
};

export const register = async ({ username, email, contact, password }) => {
  try {
    const response = await authApiInstance.post("/register", {
      username,
      email,
      contact,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await authApiInstance.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};

export const logout = async () => {
  try {
    const response = await authApiInstance.post("/logout");
    return response.data;
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};

export const fetchMe = async () => {
  try {
    const response = await authApiInstance.get("/me");
    return response.data;
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};