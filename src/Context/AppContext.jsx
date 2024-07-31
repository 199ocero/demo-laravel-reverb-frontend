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
  const [isLoading, setIsLoading] = useState(true);

  async function getUser() {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken && refreshToken) {
      getUser();
    } else {
      setIsLoading(false);
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
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
