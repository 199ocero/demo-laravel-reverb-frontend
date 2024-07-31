import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import Chat from "./Pages/Chat";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import GuestRoutes from "./utils/GuestRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "chat/:userId",
        element: (
          <ProtectedRoutes>
            <Chat />
          </ProtectedRoutes>
        ),
      },
      {
        path: "login",
        element: (
          <GuestRoutes>
            <Login />
          </GuestRoutes>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoutes>
            <Register />
          </GuestRoutes>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
