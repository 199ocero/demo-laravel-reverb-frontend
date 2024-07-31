import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import Users from "./Users";

export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <div className="w-full">
      <h1>
        Welcome back,{" "}
        <span className="font-bold text-blue-600 dark:text-blue-500">
          {user?.name}
        </span>
        !
      </h1>
      <Users />
    </div>
  );
}
