import { useEffect, useState } from 'react';
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
  startTimer: (time: number) => void;
}

export default function CombatScreen({ socket, combat, startTimer }: CombatScreenProp) {
  const [fightStarted, setFightStarted] = useState(false);
  const [problem, setProblem] = useState(null)
  const [time, setTime] = useState(0);
  const roomCode = useState<string>(() => localStorage.getItem('roomCode') || '');
  const handleStartFight = () => {
    if (combat) {
      socket?.emit('requestProblem', 0, roomCode);
    }
  };

  useEffect(() => {
    socket?.on('startGame', (problem: any) => {
      console.log(problem)
      setProblem(problem)
      setFightStarted(true);
      setTime(problem.timeLimit);
    });

    socket?.on('nextProblem', (problem: any) => {
      console.log(problem)
      setProblem(problem)
      setTime(problem.timeLimit);
    });

    return () => {
      socket?.off('startTimer');
    };
  }, []);

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [time]);

  useEffect(() => {
    startTimer(time);
  }, [time, startTimer]);

  return (
    <div className='relative overflow-hidden'>
      {!fightStarted && (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md z-50 flex justify-center items-center">
          {combat ? (
            <div className='flex flex-col justify-center items-center font-inter gap-4'>
              <h1 className='text-center font-semibold text-[1.3rem]'>We're ready to roll!</h1>
              <Button onClick={handleStartFight}>
                Start Fight
              </Button>
            </div>
          ) : (
            <div className='flex flex-col justify-center, items-center font-inter gap-4'>
              <h1 className='text-center font-semibold text-[1.3rem]'>Waiting on opponent to join...</h1>
              <Button className='text-[1.6rem]' disabled>
                {roomCode[0]}
              </Button>
            </div>
          )}
        </div>
      )}
      <div className='fixed right-10 top-[10vh] z-[20]'>
        <OpScreen socket={socket} />
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ProblemBar problem={problem}/>
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