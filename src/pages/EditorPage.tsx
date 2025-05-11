import React from "react";
import Editor from "../components/Editor";
import UserList from "../components/UserList";

const EditorPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Collaborative Editor</h2>
        <UserList />
      </div>
      <div className="flex-1">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
