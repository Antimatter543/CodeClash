import { useRef, useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as MonacoCollabExt from '@convergencelabs/monaco-collab-ext';
import { useSocket } from '@/context/SocketContext';
import * as monaco from 'monaco-editor';

// Enum for player types
const PlayerType = {
  self: "self",
  opponent: "opponent",
} as const;

interface IDEProps {
  playerType: keyof typeof PlayerType;
}

export default function IDE({ playerType }: IDEProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const socketContext = useSocket();
  const socket = socketContext.socket;
  const roomCode = socketContext.roomCode;
  const username = socketContext.username;
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    if (playerType === PlayerType.self) {
      setSender("sendOwnEdit");
      setReceiver("receiveOwnCodeEdit");
    } else {
      setSender("sendOpponentEdit");
      setReceiver("receiveOpponentCodeEdit");
    }
  }, [playerType]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Initialize Editor Content Manager
    const contentManager = new MonacoCollabExt.EditorContentManager({
      editor: editor,
      onInsert(index, text) {
        if (socket && roomCode && username) {
          socket.emit(sender, roomCode, username, "Insert", index, 0, text);
        }
        console.log("Insert", index, text);
      },
      onReplace(index, length, text) {
        if (socket && roomCode && username) {
          socket.emit(sender, roomCode, username, "Replace", index, length, text);
        }
        console.log("Replace", index, length, text);
      },
      onDelete(index, length) {
        if (socket && roomCode && username) {
          socket.emit(sender, roomCode, username, "Delete", index, length, "");
        }
        console.log("Delete", index, length);
      },
    });

    // Listen for incoming edits
    if (socket && roomCode && username) {
      socket.on(receiver, (editType, index, length, text) => {
        switch (editType) {
          case "Insert":
            contentManager.insert(index, text);
            break;
          case "Replace":
            contentManager.replace(index, length, text);
            break;
          case "Delete":
            contentManager.delete(index, length);
            break;
        }
      });
    }
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