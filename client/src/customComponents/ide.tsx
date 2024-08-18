import { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as MonacoCollabExt from '@convergencelabs/monaco-collab-ext';
import * as monaco from 'monaco-editor';
import { Socket } from 'socket.io-client';

// Enum for player types
const PlayerType = {
  self: "self",
  opponent: "opponent",
} as const;
interface IDEProps {
  playerType: keyof typeof PlayerType;
  socket: Socket | null;
  language: { [key: string]: string; };
  selectedLanguage: "Python" | "Java";
}

export default function IDE({ playerType, socket, language, selectedLanguage }: IDEProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [roomCode] = useState<string>(() => localStorage.getItem('roomCode') || '');
  const [username] = useState<string>(() => localStorage.getItem('username') || '');

  const sender = playerType === PlayerType.self ? "sendOwnEdit" : "sendOpponentEdit";
  const receiver = playerType === PlayerType.self ? "receiveOwnCodeEdit" : "receiveOpponentCodeEdit";

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Initialize Editor Content Manager
    const contentManager = new MonacoCollabExt.EditorContentManager({
      editor: editor,
      onInsert(index, text) {
        if (socket && roomCode && username) {
          socket.emit(sender, roomCode, username, "Insert", index, 0, text);
        }
      },
      onReplace(index, length, text) {
        if (socket && roomCode && username) {
          socket.emit(sender, roomCode, username, "Replace", index, length, text);
        }
      },
      onDelete(index, length) {
        if (socket && roomCode && username) {
          socket.emit(sender, roomCode, username, "Delete", index, length, "");
        }
      },
    });

    // Listen for incoming edits
    if (socket && roomCode && username) {
      const handleEdit = (editType: string, index: number, length: number, text: string) => {
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
      };

      socket.on(receiver, handleEdit);

      // Cleanup event listener on component unmount
      return () => {
        socket.off(receiver, handleEdit);
      };
    }
  };

  console.log(language[selectedLanguage])

  return (
    <div className='relative'>
      <Editor
        height="90vh"
        language={selectedLanguage.toLowerCase()}
        value={language[0][selectedLanguage]}
        onMount={handleEditorDidMount}
        options={{
          readOnly: false,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
}