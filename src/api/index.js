import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");

        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_URL}/api/refresh-token`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { access_token, refresh_token } = response.data;

        Cookies.set("access_token", access_token);
        Cookies.set("refresh_token", refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
