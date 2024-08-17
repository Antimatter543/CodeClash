import { useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InfoIcon } from "lucide-react";
import { useSocket } from '@/context/SocketContext';

export default function Navbar() {
    const location = useLocation();
    const { socket } = useSocket()

    if (socket) {
        console.log(socket.id)

    }
    return (
        <div className="flex justify-between w-full border-b-[1px] border-neutral-200 font-inter px-10 py-5">
            <h1 className="text-[1.5rem]">
                CodeClash.
            </h1>
            {location.pathname !== '/' && (
                <section className="flex gap-10 items-center">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="size-3 border border-neutral-300 bg-green-500 rounded-full"></div>
                        <div className="size-3 border border-neutral-300 rounded-full"></div>
                        <div className="size-3 border border-neutral-300 rounded-full"></div>
                    </div>
                    <p>
                        10:00
                    </p>

                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <InfoIcon style={{ color: '#a3a3a3', transition: 'color 0.3s' }} className="info-icon" />
                    </button>
                    <Avatar>
                        <AvatarImage src="https://github.com/kk4w4i.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </section>
            )}
        </div>
    );
}