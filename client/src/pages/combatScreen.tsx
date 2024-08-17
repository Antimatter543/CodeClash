import IDE from '@/customComponents/ide';
import ProblemBar from '@/customComponents/ProblemBar';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Console from '@/customComponents/Console';
import OpScreen from '@/customComponents/OpScreen';
import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';

export default function CombatScreen() {
  const { socket, roomCode, username } = useSocket();
  useEffect(() => {
    socket?.emit('requestReconnection', roomCode, username);

    socket?.on('joinRoom', (success, roomCode) => {
      if (success) {
        console.log("Joined room", roomCode);
      } else {
        console.log("Could not join room.");
      }
    });

    socket?.on('opponentJoinedRoom', () => {
      console.log()
    })
  });

  return (
    <div className='relative overflow-hidden'>
      <div className='fixed right-10 top-[10vh] z-[99]'>
        <OpScreen/>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ProblemBar/>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <IDE playerType="self"/>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={20} maxSize={50}>
              <Console/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
   
  )
}