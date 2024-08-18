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
  setSabotagePoints: any
  sabotagePoints: number
}

export default function IDE({ playerType, socket, language, selectedLanguage, question, setConsoleData, sabotagePoints, setSabotagePoints }: IDEProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [roomCode] = useState<string>(() => localStorage.getItem('roomCode') || '');
  const [username] = useState<string>(() => localStorage.getItem('username') || '');
  const [loading, setLoading] = useState(false);
 
  const sendOpponentEditCost = 1;

  const pointsRef = useRef<number>();
  pointsRef.current = sabotagePoints;

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Initialize Editor Content Manager
    const contentManager = new MonacoCollabExt.EditorContentManager({
      editor: editor,
      onInsert(index, text) { // when user types
        if (socket && roomCode && username) {
          if (playerType === PlayerType.self) {
            socket.emit('sendOwnEdit', roomCode, username, "Insert", index, 0, text);
          } else {
            if (text.length * sendOpponentEditCost <= pointsRef.current) {
              socket.emit('sendOpponentEdit', roomCode, username, "Insert", index, 0, text);
              setSabotagePoints(pointsRef.current - (text.length * sendOpponentEditCost));
              // console.log("onInsert() remaining sabotage points:", pointsRef.current);
            } else {
              console.log("Not enough RAM for this edit!");
              editor.trigger("keyboard", "undo", null);
            }
          }
        }
      },
      onReplace(index, length, text) {
        if (socket && roomCode && username) {
          if (playerType === PlayerType.self) {
            socket.emit('sendOwnEdit', roomCode, username, "Replace", index, length, text);
          } else {
            if (text.length * sendOpponentEditCost <= pointsRef.current && length * sendOpponentEditCost <= pointsRef.current) {
              socket.emit('sendOpponentEdit', roomCode, username, "Replace", index, length, text);
              setSabotagePoints(pointsRef.current - (Math.max(text.length, length) * sendOpponentEditCost));
              // console.log("onReplace() remaining sabotage points:", pointsRef.current);
            } else {
              console.log("Not enough RAM for this edit!");
              editor.trigger("keyboard", "undo", null);
            }
          }
        }
      },
      onDelete(index, length) {
        if (socket && roomCode && username) {
          if (playerType === PlayerType.self) {
            socket.emit('sendOwnEdit', roomCode, username, "Delete", index, length, "");
          } else {
            if (length * sendOpponentEditCost <= pointsRef.current) {
              socket.emit('sendOpponentEdit', roomCode, username, "Delete", index, length, "");
              setSabotagePoints(pointsRef.current - (length * sendOpponentEditCost));
              // console.log("onDelete() remaining sabotage points:", pointsRef.current);
            } else {
              console.log("Not enough RAM for this edit!");
              editor.trigger("keyboard", "undo", null);
            }
          }
        }
      },
    });

    // socket listeners
    if (socket && roomCode && username) {
      const receiver = playerType === PlayerType.self ? "receiveOwnCodeEdit" : "receiveOpponentCodeEdit";
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
  
      socket.on('triggerCodeSwap', (username: string) => {

      });
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