import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import CombatScreen from "./combatScreen";
import Navbar from "@/customComponents/Navbar";
import pythonwebp from '../assets/webp/python.webp'
import javawebp from '../assets/webp/java.webp'
import jswebp from '../assets/webp/js.webp'
import cppwebp from '../assets/webp/c++.webp'

type Language = 'python' | 'java';

export default function SetupScreen() {
    const [inputuser, setInputUsername] = useState('');
    const [inputRoomCode, setInputRoomCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [ready, setReady] = useState(false);
    const [combat, setCombat] = useState(false); // State to control CombatScreen visibility
    const [showRefreshDialog, setShowRefreshDialog] = useState(false); // State for refresh dialog
    const serverURL = 'http://localhost:3000';

    const [socket, setSocket] = useState<Socket | null>(null);
    const [formattedTime, setFormattedTime] = useState('00:00');
    const [language, setLanguage] = useState<Language>('python');

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        setShowRefreshDialog(true);
    };

    useEffect(() => {
        const newSocket = io(serverURL);
        setSocket(newSocket);

        newSocket.on('confirmJoin', (success: boolean, roomCode: string, username: string) => {
            if (success) {
                localStorage.setItem('roomCode', roomCode);
                localStorage.setItem('username', username);
                setReady(true);
            }
        });

        newSocket.on('confirmCreateRoom', (success: boolean, roomCode: string, username: string) => {
            if (success) {
                localStorage.setItem('roomCode', roomCode);
                localStorage.setItem('username', username);
                setReady(true);
            }
        });

        newSocket.on('playersJoinedRoom', (success: boolean, opponent: string) => {
            console.log(success);
            localStorage.setItem('opponent', opponent);
            setCombat(success);
            console.log("setSuccess", success);
        });

        // Add beforeunload event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            newSocket.disconnect();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = (time: number) => {
        setFormattedTime(formatTime(time));
    };

    const handleCreateRoom = () => {
        if (!socket) {
            setErrorMessage("Error Connecting to socket");
            return;
        }
        if (!inputuser) {
            setErrorMessage('User name is required');
            return;
        }
        
        socket.emit('requestCreateRoom', inputuser);
    };

    const handleJoinRoom = () => {
        if (!socket) {
            setErrorMessage("Error Connecting to socket");
            return;
        }
        if (!inputuser || !inputRoomCode) {
            setErrorMessage('Both username and room code are required.');
            return;
        }
        if (inputRoomCode.length !== 4) {
            setErrorMessage("Invalid room code");
            return;
        }
        
        socket.emit('requestJoinRoom', inputRoomCode, inputuser);
        
        setErrorMessage('');
    };

    const handleRefreshConfirmation = (confirm: boolean) => {
        if (confirm) {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.location.reload();
        } else {
            setShowRefreshDialog(false);
        }
    };

    return (
        <div className="h-full">
            <Navbar combat={combat} time={formattedTime} onLanguageChange={setLanguage}/>
            {!ready &&
                <div className="font-inter w-full h-[65%] flex flex-col justify-center items-center gap-[4rem]">
                    <section className="text-center">
                        <p className="font-semibold text-[2rem]">Show who's the real dev.</p>
                        <p className="mt-2">Online PvP leetcode. Like Tetris but leetcode.</p>
                    </section>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2 font-inter z-[5]">Start Now</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="font-inter">Start Game</DialogTitle>
                                <DialogDescription className="font-inter">
                                    Either create a new room or join an existing room.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right font-inter">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        className="col-span-3"
                                        onChange={(e) => setInputUsername(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="roomCode" className="text-right font-inter">
                                        Room Code
                                    </Label>
                                    <Input
                                        id="roomCode"
                                        className="col-span-3"
                                        onChange={(e) => setInputRoomCode(e.target.value)}
                                    />
                                </div>
                                {errorMessage && (
                                    <div className="text-red-500 col-span-4 text-center font-inter">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button className="font-inter" type="button" onClick={handleCreateRoom}>Create room</Button>
                                <Button className="font-inter" type="button" onClick={handleJoinRoom}>Join room</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="fixed grid grid-cols-4 w-full z-[1] bottom-[30rem]">
                        <div className="relative">
                            <img className="absolute size-[22rem] right-[-12rem] top-[2rem]" alt="python webp" src={pythonwebp}></img>
                        </div>
                        <div className="relative">
                            <img className="absolute size-[30rem] right-[-5rem]" alt="java webp" src={javawebp}></img>
                        </div>
                        <div className="relative">
                            <img className="absolute size-[29rem] left-[-4rem]" alt="js webp" src={jswebp}></img>
                        </div>
                        <div className="relative">
                            <img className="absolute size-[26rem] left-[-12rem] top-[-1rem]" alt="cpp webp" src={cppwebp}></img>
                        </div>
                    </div>
                </div>
            }
            {ready && <CombatScreen combat={combat} socket={socket} startTimer={handleTimeUpdate} selectedLanguage={language}/>}
            
            {/* Dialog for refresh confirmation */}
            {showRefreshDialog && (
                <Dialog open={showRefreshDialog} onOpenChange={setShowRefreshDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-inter">Leave Game?</DialogTitle>
                            <DialogDescription className="font-inter">
                                Are you sure you want to leave the game? All progress will be lost.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="destructive" className="font-inter" type="button" onClick={() => handleRefreshConfirmation(true)}>Yes, Leave</Button>
                            <Button className="font-inter" type="button" onClick={() => handleRefreshConfirmation(false)}>Continue</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}