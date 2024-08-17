import { useState } from 'react';
import IDE from '@/customComponents/ide';
import ProblemBar from '@/customComponents/ProblemBar';
import { Socket } from 'socket.io-client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Console from '@/customComponents/Console';
import OpScreen from '@/customComponents/OpScreen';
import { Button } from '@/components/ui/button';

interface CombatScreenProp {
  socket: Socket | null;
  combat: boolean;
}

export default function CombatScreen({ socket, combat }: CombatScreenProp) {
  const [fightStarted, setFightStarted] = useState(false);

  const handleStartFight = () => {
    if (combat) {
      setFightStarted(true);
    }
  };

  return (
    <div className='relative overflow-hidden'>
      {!fightStarted && (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md z-50 flex justify-center items-center">
          {combat ? (
            <Button onClick={handleStartFight}>
              Start Fight
            </Button>
          ) : (
            <Button disabled>
              Start Fight
            </Button>
          )}
        </div>
      )}
      <div className='fixed right-10 top-[10vh] z-[20]'>
        <OpScreen socket={socket} />
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ProblemBar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <IDE playerType="self" socket={socket} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={20} maxSize={50}>
              <Console />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}