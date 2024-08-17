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

interface CombatScreenProp {
  socket: Socket | null;
}

export default function CombatScreen({socket}: CombatScreenProp) {
  return (
    <div className='relative overflow-hidden'>
      <div className='fixed right-10 top-[10vh] z-[99]'>
        <OpScreen socket={socket}/>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ProblemBar/>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <IDE playerType="self" socket={socket}/>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={20} maxSize={50}>
              <Console/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}