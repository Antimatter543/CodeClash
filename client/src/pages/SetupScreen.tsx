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
import { useSocket } from "@/context/SocketContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetupScreen() {
    const socketContext = useSocket();
    const [inputuser, setInputUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const socket = socketContext.socket;
    const setUsername = socketContext.setUsername;
    const navigate = useNavigate()

    const handleCreateRoom = () => {
        if (!socket) {
            setErrorMessage("Error Connecting to socket");
            return;
        }
        if (!inputuser) {
            setErrorMessage('User name is required');
            return;
        }
        
        setUsername(inputuser);
        socket.emit('requestCreateRoom', inputuser);
        
        // Store username in local storage
        localStorage.setItem('username', inputuser);
        navigate('/battle')

        setErrorMessage('');
    }

    const handleJoinRoom = () => {
        if (!socket) {
            setErrorMessage("Error Connecting to socket");
            return;
        }
        if (!inputuser || !roomCode) {
            setErrorMessage('Both username and room code are required.');
            return;
        }
        if (roomCode.length !== 4) {
            setErrorMessage("Invalid room code");
            return;
        } else if (roomCode === socketContext.roomCode) {
            setErrorMessage("Already in room");
            return;
        }
        
        setUsername(inputuser);
        socket.emit('requestJoinRoom', inputuser, roomCode);
        
        // Store username and room code in local storage
        localStorage.setItem('username', inputuser);
        localStorage.setItem('roomCode', roomCode);

        navigate('/battle')
        
        setErrorMessage('');
    };

    console.log(socketContext);

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
                                onChange={(e) => setRoomCode(e.target.value)}
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