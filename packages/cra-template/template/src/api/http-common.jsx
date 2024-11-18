import axios from "axios";
import CryptoJS from "crypto-js";

const api = axios.create({
  baseURL: "https://reqres.in/api/",

  headers: {
    "Content-Type": "application/json",
  },
}); 

const setAuthorizationHeader = (config) => {
  const token = sessionStorage.getItem("access");
  if (config.url === "/" /* || window.location.pathname == "/" */) {
    return config;
  }
  if (config.url !== "/" && token) {
    const accessToken = CryptoJS.AES.decrypt(token, "usermanagement").toString(
      CryptoJS.enc.Utf8
    );
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.log("window.location.href = "/";")
  }
  return config;
};

api.interceptors.request.use(
  (config) => setAuthorizationHeader(config),
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.config.url !== "/" &&
      error.response.status === 401
    ) {
      console.log("window.location.href = "/";")
    }
    return Promise.reject(error);
  }
);

export default api;