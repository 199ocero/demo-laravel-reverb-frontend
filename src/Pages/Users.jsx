import { useEffect, useState } from "react";
import api from "../api";
import UserCard from "../components/UserCard";
export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="mt-5">
        <h1>Select a user to chat:</h1>
        <div className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2 md:grid-cols-4">
          {users && users.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      </div>
    </>
  );
}
