import { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as MonacoCollabExt from '@convergencelabs/monaco-collab-ext';
import * as monaco from 'monaco-editor';
import { Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// Enum for player types
const PlayerType = {
  self: "self",
  opponent: "opponent",
} as const;

interface LanguageObject {
  [key: string]: string;
}

type LanguageArray = [LanguageObject];
interface IDEProps {
  playerType: keyof typeof PlayerType;
  socket: Socket | null;
  language: LanguageArray;
  selectedLanguage: "Python" | "Java";
  question: string | undefined;
  setConsoleData: any
}

export default function IDE({ playerType, socket, language, selectedLanguage, question, setConsoleData }: IDEProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [roomCode] = useState<string>(() => localStorage.getItem('roomCode') || '');
  const [username] = useState<string>(() => localStorage.getItem('username') || '');
  const [loading, setLoading] = useState(false);

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

  // Function to send editor content to the API
  const sendCodeToAPI = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      console.log("Selected Language:", selectedLanguage);
      console.log("Question Number:", question);
      console.log("Code to Submit:\n", code);

      if (question) {
        const data = {
          language: selectedLanguage,
          question_number: question,
          user_code: code,
        };
        const API_URL = "http://54.253.188.5:5000/submit-code";

        try {
          setLoading(true);
          console.log("Sending request to API...");

          const response = await axios.post(API_URL, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log("Response received.");
          console.log("Status Code:", response.status);
          console.log("Response JSON:", response.data);
          setConsoleData(response.data)
        } catch (error) {
          console.error("Error sending code to API:", error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className='relative w-full'>
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
      {!(playerType === "opponent") &&
        <Button className="fixed bottom-[5vh] left-[5vw] z-[10]" disabled={loading} onClick={sendCodeToAPI}>{loading ? "Submitting..." : "Submit Code"}</Button>
      }
    </div>
  );
}