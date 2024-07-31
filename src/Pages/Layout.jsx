import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import Cookies from "js-cookie";
import api from "../api";

export default function Layout() {
  const { user, setUser, accessToken, setAccessToken, setRefreshToken } =
    useContext(AppContext);

  const navigate = useNavigate();

  // Initialize state from localStorage or default to "dark"
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });

  useEffect(() => {
    // Apply theme class to the document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const location = useLocation();

  async function handleLogout(e) {
    e.preventDefault();

    const response = await api.post("/api/logout", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      navigate("/");
    }
  }

  return (
    <>
      <header>
        <nav className="bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between max-w-6xl p-4 mx-auto">
            <Link
              to="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="text-2xl font-bold text-blue-700 dark:text-white">
                Laravel
              </span>
            </Link>
            <div>
              <ul className="flex flex-row items-center p-0 mt-0 space-x-8 font-medium border-0 border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                {user ? (
                  <li>
                    <div className="flex items-center space-x-8">
                      <p>{user.name}</p>
                      <form onSubmit={handleLogout}>
                        <button className="text-blue-600 dark:text-blue-500 active-nav-link">
                          Logout
                        </button>
                      </form>
                    </div>
                  </li>
                ) : (
                  <>
                    <li
                      className={
                        location.pathname === "/login" ? "active-nav-link" : ""
                      }
                    >
                      <Link
                        to="/login"
                        className="text-blue-600 dark:text-blue-500"
                        aria-current="page"
                      >
                        Login
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/register"
                          ? "active-nav-link"
                          : ""
                      }
                    >
                      <Link
                        to="/register"
                        className="text-blue-600 dark:text-blue-500"
                        aria-current="page"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="p-2 text-sm font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      {theme === "light" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-6xl p-4 mx-auto">
        <Outlet />
      </main>
    </>
  );
}
