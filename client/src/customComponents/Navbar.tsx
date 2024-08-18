import { InfoIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = 'python' | 'java';

interface NavbarProps {
  combat: boolean;
  time: string;
  onLanguageChange: (selectedLanguage: Language) => void;
}

export default function Navbar({ combat, time, onLanguageChange }: NavbarProps) {
  const [, setLanguage] = useState<Language>('python');

  const handleLanguageChange = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    onLanguageChange(selectedLanguage);
  };

  return (
    <div className="w-full font-inter">
      {combat ? (
        <div className="flex justify-between w-full border-b-[1px] border-neutral-200 font-inter px-10 py-5">
          <h1 className="text-[1.5rem]">
            CodeDuel.
          </h1>
          <section className="flex gap-10 items-center">
            <Select onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-center space-x-4">
              <div className="size-3 border border-neutral-300 bg-green-500 rounded-full"></div>
              <div className="size-3 border border-neutral-300 rounded-full"></div>
              <div className="size-3 border border-neutral-300 rounded-full"></div>
            </div>

            <p>{time}</p>

            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <InfoIcon style={{ color: '#a3a3a3', transition: 'color 0.3s' }} className="info-icon" />
            </button>
          </section>
        </div>
      ) : (
        <div className="flex justify-center w-full font-inter px-10 py-5 mt-10">
          <h1 className="text-[3rem]">
            CodeDuel.
          </h1>
        </div>
      )}
    </div>
  );
}