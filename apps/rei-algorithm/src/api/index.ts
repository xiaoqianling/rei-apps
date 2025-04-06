import axios from "axios";

export const serverDomain = "http://localhost:8080/api/";

export const axiosInstance = axios.create({
  baseURL: serverDomain,
});
