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

import Github from '../assets/svg/svg';
import { useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import CombatScreen from "./combatScreen";

export default function SetupScreen() {
    const [inputuser, setInputUsername] = useState('');
    const [inputRoomCode, setInputRoomCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [combat, setCombat] = useState(false); // State to control CombatScreen visibility
    const serverURL = 'http://localhost:3000';

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(serverURL);
        setSocket(newSocket);

        newSocket.on('confirmJoin', (success: boolean, roomCode: string, username: string) => {
            if (success) {
                localStorage.setItem('roomCode', roomCode);
                localStorage.setItem('username', username);
                setCombat(true); // Set combat to true on successful join
            }
        });

        newSocket.on('confirmCreateRoom', (success: boolean, roomCode: string, username: string) => {
            if (success) {
                localStorage.setItem('roomCode', roomCode);
                localStorage.setItem('username', username);
                setCombat(true); // Set combat to true on successful room creation
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

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

    return (
        <div>
            {!combat &&
                <div className="font-inter w-full h-full flex flex-col justify-center items-center gap-[4rem]">
                    <section className="text-center">
                        <p className="font-semibold text-[2rem]">Show who's the real dev.</p>
                        <p className="mt-2">Online PvP leetcode. Like Tetris but leetcode.</p>
                    </section>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2" variant="outline">Start with your <Github /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Start Game</DialogTitle>
                                <DialogDescription>
                                    Either create a new room or join an existing room.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        defaultValue="leetcoder123"
                                        className="col-span-3"
                                        onChange={(e) => setInputUsername(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="roomCode" className="text-right">
                                        Room Code
                                    </Label>
                                    <Input
                                        id="roomCode"
                                        className="col-span-3"
                                        onChange={(e) => setInputRoomCode(e.target.value)}
                                    />
                                </div>
                                {errorMessage && (
                                    <div className="text-red-500 col-span-4 text-center">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={handleCreateRoom}>Create room</Button>
                                <Button type="button" onClick={handleJoinRoom}>Join room</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            }
            {combat && <CombatScreen socket={socket}/>} {/* Render CombatScreen only if combat is true */}
        </div>
    );
}