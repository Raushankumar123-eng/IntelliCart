import axios from "axios";

const API = axios.create({
  baseURL: "https://intellicart.onrender.com/api/v1",
  withCredentials: true,
});

export default API;
