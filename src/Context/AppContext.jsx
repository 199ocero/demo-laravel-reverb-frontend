import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState(Cookies.get("access_token"));
  const [refreshToken, setRefreshToken] = useState(
    Cookies.get("refresh_token")
  );

  const [user, setUser] = useState(null);

  async function getUser() {
    try {
      const response = await api.get("/api/user/me");

      if (response.status === 200) {
        setUser(response.data.data);
      }
    } catch (error) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  }

  useEffect(() => {
    if (accessToken && refreshToken) {
      getUser();
    }
  }, [accessToken, refreshToken]);

  return (
    <AppContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
