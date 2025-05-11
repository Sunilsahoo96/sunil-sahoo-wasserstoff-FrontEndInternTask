import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { socket } from "../socket/socket"; // Assuming socket.js is set up
import { useUser } from "../context/UserContext";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { username } = useUser();
  const [typingUser, setTypingUser] = useState("");
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    let quillInstance: Quill | null = null;
    let cursors: any = null;
    let isApplyingRemoteChange = false;

    if (editorRef.current) {
      quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start collaborating...",
        modules: {
          cursors: {},
          toolbar: [["bold", "italic", "underline"], [{ header: [1, 2, false] }]],
        },
      });

      // Only send changes when the local user types
      quillInstance.on("text-change", (delta, oldDelta, source) => {
        if (source === "user" && !isApplyingRemoteChange && quillInstance) {
          const selection = quillInstance.getSelection();
          const index = selection?.index ?? 0;
          const [line, offset] = quillInstance.getLine(index);

          socket.emit("send-changes", {
            delta,
            username,
            position: index, // optional
            lineContent: line?.domNode?.innerText ?? "", // optional
          });

          socket.emit("typing", username);
        }
      });

      // Cursor sharing
      quillInstance.on("selection-change", (range) => {
        if (range && quillInstance) {
          socket.emit("cursor-change", { range, username });
        }
      });

      // Apply changes from others without triggering emit back
      socket.on("receive-changes", ({ delta, username: editor, position, lineContent }) => {
        if (quillInstance) {
          isApplyingRemoteChange = true;
          quillInstance.updateContents(delta);
          isApplyingRemoteChange = false;

          // Log or update history state
          const message = `${editor} edited line: "${lineContent?.trim() || '[unknown]'}"`;
          setEditHistory((prev) => [message, ...prev.slice(0, 9)]); // show last 10 edits
        }
      });

      socket.on("receive-cursor", ({ username: user, range }) => {
        if (user !== username && cursors && typeof cursors.setCursor === "function") {
          cursors.setCursor(user, range, user, "#f00");
        }
      });

      socket.on("user-typing", (name: string) => {
        if (name !== username) {
          setTypingUser(name);
          setTimeout(() => setTypingUser(""), 4000);  // Clear after 4 seconds
        }
      });

      // Listen for the update to the active user list
      socket.on("update-user-list", (users: string[]) => {
        setActiveUsers(users);
      });

      // Emit user-joined event
      socket.emit("user-joined", username);

      return () => {
        socket.off("receive-changes");
        socket.off("receive-cursor");
        socket.off("user-typing");
        socket.off("update-user-list");
      };
    }
  }, [username]);

  return (
    <div className="relative h-full">
      {/* Typing Indicator */}
      {typingUser && (
        <div className="absolute top-0 right-4 bg-yellow-300 px-2 py-1 text-sm text-black rounded z-10">
          {typingUser} is typing...
        </div>
      )}

      {/* Editor Content */}
      <div className="h-full" ref={editorRef}></div>

      {/* Edit History Panel */}
      <div className="absolute bottom-0 right-0 bg-white/90 text-black rounded p-2 m-2 w-72 max-h-40 overflow-y-auto text-sm shadow-lg z-20">
        <strong>Edit Activity</strong>
        <ul className="list-disc list-inside">
          {editHistory.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>

      {/* Active Users Panel */}
      {/* Active Users Panel */}
<div className="absolute bottom-0 left-0 bg-white/90 text-black rounded p-2 m-2 w-72 max-h-40 overflow-y-auto text-sm shadow-lg z-20">
  <strong className="block mb-2">Active Users</strong>
  <ul className="space-y-1">
    {[...activeUsers]
      .sort((a, b) => (a === username ? -1 : b === username ? 1 : 0))
      .map((user, idx) => {
        const isCurrentUser = user === username;
        return (
          <li
            key={idx}
            className={`flex items-center gap-2 px-3 py-1 rounded ${
              isCurrentUser ? "bg-green-100 font-semibold" : "bg-green-50"
            }`}
          >
            <span className="text-green-500 text-xs">●</span>
            <span>
              {user} {isCurrentUser && "(you)"}
            </span>
          </li>
        );
      })}
  </ul>
</div>

    </div>
  );
};

export default Editor;
