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

interface LanguageObject {
  [key: string]: string;
}

type LanguageArray = [LanguageObject];
interface CombatScreenProp {
  socket: Socket | null;
  combat: boolean;
  startTimer: (time: number) => void;
  selectedLanguage: "Python" | "Java";
}

interface Problem {
  title: string;
  details: string;
  examples: Array<{ input: string; output: string }>;
  constraints: string[];
  timeLimit: number;
  language: LanguageArray;
}

export default function CombatScreen({ socket, combat, startTimer, selectedLanguage }: CombatScreenProp) {
  const [fightStarted, setFightStarted] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [time, setTime] = useState(0);
  const [roomCode] = useState<string>(() => localStorage.getItem('roomCode') || '');
  const [consoleData, setConsoleData] = useState(null);

  const handleStartFight = () => {
    if (combat) {
      socket?.emit('requestProblem', 0, roomCode);
    }
  };

  useEffect(() => {
    const handleStartGame = (problem: Problem) => {
      console.log(problem)
      setProblem(problem);
      setFightStarted(true);
      setTime(problem.timeLimit);
    };

    const handleNextProblem = (problem: Problem) => {
      console.log(problem);
      setProblem(problem);
      setTime(problem.timeLimit);
    };

    socket?.on('startGame', handleStartGame);
    socket?.on('nextProblem', handleNextProblem);

    return () => {
      socket?.off('startGame', handleStartGame);
      socket?.off('nextProblem', handleNextProblem);
    };
  }, [socket]);

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

  const questionTitle = problem?.title;
  const question = questionTitle?.split(' ')[0]?.replace(/\D/g, '');
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
            <div className='flex flex-col justify-center items-center font-inter gap-4'>
              <h1 className='text-center font-semibold text-[1.3rem]'>Waiting on opponent to join...</h1>
              <Button className='text-[1.6rem]' disabled>
                {roomCode}
              </Button>
            </div>
          )}
        </div>
      )}
      {problem &&
        <div>
          <div className='fixed right-10 top-[10vh] z-[20]'>
            <OpScreen socket={socket} language={problem.language} selectedLanguage={selectedLanguage} question={question}/>
          </div>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={20}>
              <ProblemBar problem={problem}/>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel>
                  <IDE playerType="self" 
                    socket={socket}
                    language={problem.language} 
                    selectedLanguage={selectedLanguage} 
                    question={question}
                    setConsoleData={setConsoleData}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={20} minSize={20} maxSize={50}>
                  <Console data={consoleData}/>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      }
    </div>
  );
}