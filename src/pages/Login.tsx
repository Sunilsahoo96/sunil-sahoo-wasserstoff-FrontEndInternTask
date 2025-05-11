import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { setUsername } = useUser();

  const handleLogin = () => {
    if (name.trim()) {
      setUsername(name.trim());
      navigate("/editor");
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow w-96">
        <h1 className="text-2xl mb-4">Enter Your Name</h1>
        <input
          className="w-full p-2 mb-4 text-black rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
          onClick={handleLogin}
        >
          Join Editor
        </button>
      </div>
    </div>
  );
};

export default Login;
