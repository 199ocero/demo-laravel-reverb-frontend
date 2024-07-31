import { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, isLoading } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && !isLoading) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (user === null) {
    return null;
  }

  return children;
};

export default ProtectedRoutes;