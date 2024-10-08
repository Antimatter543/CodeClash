import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useShortCut from "../utils/useShortCut"; // Adjust the path as necessary
import { X } from "lucide-react";
import IDE from "./ide";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Socket } from 'socket.io-client';

interface LanguageObject {
    [key: string]: string;
  }
  
type LanguageArray = [LanguageObject];

interface OpScreenProps {
    socket: Socket | null;
    language: LanguageArray;
    selectedLanguage: "Python" | "Java";
    question: string | undefined
    sabotagePoints: number
    setSabotagePoints: any
}

export default function OpScreen({ socket, language, selectedLanguage, question, sabotagePoints, setSabotagePoints}: OpScreenProps) {
    const [open, setOpen] = useState(false);
    const shortcutPressed = useShortCut("k", "metaKey");
    const opponent = useState<string>(() => localStorage.getItem('opponent') || '');

    useEffect(() => {
        if (shortcutPressed) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [shortcutPressed]);

    return (
        <div className="text-white font-inter">
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-0 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}
            <motion.div
                onClick={!open ? () => setOpen((t) => !t) : undefined}
                className="element flex justify-center items-start border rounded-[10px] overflow-hidden py-2 bg-white drop-shadow-lg z-10"
                style={
                    open
                        ? { position: "fixed", placeItems: "start", width: "94vw", height: "80%" }
                        : { height: 150, width: 250 }
                }
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
                layout
            >
                <IDE 
                    playerType="opponent" 
                    socket={socket} 
                    language={language} 
                    selectedLanguage={selectedLanguage} 
                    question={question} 
                    setConsoleData={null} 
                    sabotagePoints={sabotagePoints}
                    setSabotagePoints={setSabotagePoints}/>
                {(!open && opponent) && (
                    <div className="absolute inset-0 bg-black/20 flex justify-center items-center z-10 backdrop-blur-sm">
                        <Avatar className="size-[3.5rem]">
                            <AvatarImage src={`https://github.com/${opponent}.png`} />
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </div>
                )}
                {open && (
                    <div>
                        <p className="absolute bottom-2 right-5 text-black font-inter text-center text-[1.5rem]">RAM left: {sabotagePoints}</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                            }}
                            className="absolute top-3 right-3 bg-black/20 rounded-full p-2"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                    
                )}
            </motion.div>
        </div>
    );
}