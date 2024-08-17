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
// import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';

export default function SetupScreen() {
    // const { setRoomCode, socket, setUsername } = useSocket();
    const [inputuser, setInputUsername] = useState('');
    const [inputRoomCode, setInputRoomCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log("connected to server with id", socket.id);
    });

    useEffect(() => {

        setInputRoomCode(localStorage.getItem('roomCode') || '');
        setInputUsername(localStorage.getItem('username') || '');

        socket?.on('confirmCreateRoom', (roomCode) => {
            setInputRoomCode(roomCode);
            console.log(socket.id);
            console.log("Room was created", roomCode);
            // socket.emit('requestJoinRoom', roomCode, inputuser);
        });

        socket?.on('confirmJoin', () => {
            console.log("joined room", inputRoomCode, ", waiting for opponent")
        });

        socket?.on('playersJoinedRoom', (roomCode) => {
            console.log("All players joined. Going to battle page");
            localStorage.setItem('username', inputuser);
            localStorage.setItem('roomCode', inputRoomCode);
            navigate('/battle');
        });
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
        
        console.log("requestCreateRoom");
        socket.emit('requestCreateRoom');
    }

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
        
        socket.emit('requestJoinRoom', inputuser, inputRoomCode);
        
        // Store username and room code in local storage
        
        setErrorMessage('');
    };

    return (
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
                                // value = {inputRoomCode}
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
    );
}