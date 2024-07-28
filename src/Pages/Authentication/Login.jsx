import { useContext, useState } from "react";
import api from "../../api/index.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AppContext } from "../../Context/AppContext.jsx";

export default function Login() {
  const { setAccessToken, setRefreshToken } = useContext(AppContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.post("/api/login", formData);

      Cookies.set("access_token", response.data.access_token);
      Cookies.set("refresh_token", response.data.refresh_token);

      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);

      navigate("/");
    } catch (error) {
      // Initialize errors as an empty object
      let errors = {};

      if (error.response.status === 422) {
        errors = error.response.data.errors;
      } else {
        errors = { message: error.response.data.message };
      }

      setErrors(errors);
    }
  }

  return (
    <>
      <h1 className="mt-10 text-3xl font-bold text-center">Login</h1>

      <form onSubmit={handleLogin} className="max-w-md mx-auto mt-5">
        {errors?.message && (
          <p className="px-2 py-1 mb-2 text-white bg-red-600 rounded-lg dark:bg-red-300 dark:text-red-900">
            {errors.message}
          </p>
        )}
        <div className="flex flex-col space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="text"
              id="email"
              className="input-field"
              placeholder="john@gmail.com"
            />
            {errors?.email && (
              <p className="input-field-error">{errors.email[0]}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              id="password"
              className="input-field"
              placeholder="Password"
            />
            {errors?.password && (
              <p className="input-field-error">{errors.password[0]}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </>
  );
}
