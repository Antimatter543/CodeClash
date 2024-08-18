import { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as MonacoCollabExt from '@convergencelabs/monaco-collab-ext';
import * as monaco from 'monaco-editor';
import { Socket } from 'socket.io-client';
import { Play } from 'lucide-react';

// Enum for player types
const PlayerType = {
  self: "self",
  opponent: "opponent",
} as const;

interface IDEProps {
  playerType: keyof typeof PlayerType;
  socket: Socket | null;
}

export default function IDE({ playerType, socket }: IDEProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const roomCode = useState<string>(() => localStorage.getItem('roomCode') || '');
  const username = useState<string>(() => localStorage.getItem('username') || '');

  const [sabotagePoints, setSabotagePoints] = useState(10);
  const [shortcutsDisabled, setShortcutsDisabled] = useState(false);
  const [shortcutsCooldown, setShortcutsCooldown] = useState(0);
  const [arrowKeysReversed, setArrowKeysReversed] = useState(false);
  const [arrowKeysCooldown, setArrowKeysCooldown] = useState(0);
  const [mouseDisabled, setMouseDisabled] = useState(true);
  const [mouseCooldown, setMouseCooldown] = useState(0);
  const [prevCursorPosition, setPrevCursorPosition] = useState([1, 1]);

  const sendOpponentEditCost = 1;

  const pointsRef = useRef<number>();
  pointsRef.current = sabotagePoints;
  const prevCursorPosRef = useRef<number[]>();
  prevCursorPosRef.current = prevCursorPosition;
  const arrowKeysReversedRef = useRef<boolean>();
  arrowKeysReversedRef.current = arrowKeysReversed;

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
  
      // socket?.on('triggerReverseArrowKeys', (username: string) => {
      //   setArrowKeysReversed(true);
      //   setArrowKeysCooldown(60);
      //   console.log(username, "disabled your arrow keys!");
      // });

      socket.on('triggerCodeSwap', (username: string) => {

      });
    }

    // editorRef.current.onDidChangeCursorPosition((e) => {
    //   if (playerType === PlayerType.self) {
    //     console.log(JSON.stringify(e));
    //     const lineNumber = e.position.lineNumber;
    //     const column = e.position.column;
    //     if (e.source === "keyboard") {
    //       if (arrowKeysReversedRef.current) {
    //         editorRef.current.setPosition({
    //           lineNumber: lineNumber + (lineNumber - prevCursorPosRef.current[0]) * -2, 
    //           column: column + (column - prevCursorPosRef.current[1]) * -2,
    //         });
    //       }
    //     }
    //     setPrevCursorPosition([lineNumber, column]);
    //   }
    // });
  };

  

  // 
  // useEffect(() => {
  //   if (playerType === PlayerType.opponent) {
  //     if (sabotagePoints >= sendOpponentEditCost) { // can send sabotages
  //       editorRef.current?.updateOptions({ readOnly: false });
  //     } else {
  //       editorRef.current?.updateOptions({ readOnly: true });
  //     }
  //   }
  // }, [sabotagePoints]);

  useEffect(() => {
    console.log("sabotagePoints remaining", pointsRef.current);
  }, [sabotagePoints]);

  useEffect(() => {
    if (playerType === PlayerType.self) {
      if (mouseDisabled) {
        // lock the pointer
      } else {
        // document.exitPointerLock();
      }
    }
  }, [mouseDisabled]);



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