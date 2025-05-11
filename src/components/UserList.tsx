import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useUser } from "../context/UserContext";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const { username } = useUser();

  useEffect(() => {
    socket.emit("user-joined", username);

    socket.on("update-user-list", (userList: string[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off("update-user-list");
    };
  }, [username]);

  return (
    <div className="flex gap-2">
      {users.map((user) => (
        <span
          key={user}
          className={`px-2 py-1 rounded text-sm ${
            user === username ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          {user}
        </span>
      ))}
    </div>
  );
};

export default UserList;
