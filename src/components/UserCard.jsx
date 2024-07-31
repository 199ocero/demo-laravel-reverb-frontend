import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <div className="w-full p-5 bg-gray-200 rounded-lg dark:bg-gray-900">
      <p>{user.name}</p>
      <Link
        to={`/chat/${user.id}`}
        className="text-blue-600 dark:text-blue-500"
      >
        Send a message
      </Link>
    </div>
  );
}
