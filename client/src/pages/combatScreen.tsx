import IDE from '@/customComponents/ide';
import ProblemBar from '@/customComponents/ProblemBar';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Console from '@/customComponents/Console';
import OpScreen from '@/customComponents/OpScreen';

export default function CombatScreen() {
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
              <IDE/>
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