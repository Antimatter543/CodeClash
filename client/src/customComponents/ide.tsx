import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as MonacoCollabExt from '@convergencelabs/monaco-collab-ext';
import { useSocket } from '@/context/SocketContext';
import * as monaco from 'monaco-editor'; // Import monaco-editor types

export default function IDE() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const socketContext = useSocket();
  const socket = socketContext.socket
  const roomCode = socketContext.roomCode
  const username = socketContext.username

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Initialize Editor Content Manager
    const contentManager = new MonacoCollabExt.EditorContentManager({
      editor: editor,
      onInsert(index, text) {
        if (socket) {
          socket.emit("sendInsert", index, text, roomCode, username);
        }
        console.log("Insert", index, text);
      },
      onReplace(index, length, text) {
        if (socket) {
          socket.emit("sendReplace", index, text, roomCode, username);
        }
        console.log("Replace", index, length, text);
      },
      onDelete(index, length) {
        if (socket) {
          socket.emit("sendDelete", index, length, roomCode, username);
        }
        console.log("Delete", index, length);
      },
    });

    // Example: Insert text
    contentManager.insert(5, "some text");
};

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onMount={handleEditorDidMount}
      options={{
        readOnly: false,
        minimap: { enabled: false },
      }}
    />
  );
}