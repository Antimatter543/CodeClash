import { useEffect, useState } from "react";

interface NavbarProps {
  data: any[];
}

export default function Console({ data }: NavbarProps) {
    const [passed, setPassed] = useState(false)
  useEffect(() => {
    if (data) {
      console.log('Data received in Console:', data);
      // Handle the data as neede
      if (data.total_tests === data.passed_tests) {
        setPassed(true)
      }
    }
  }, [data]);

  return (
    <div className="w-full h-full p-10">
      {data && (
        <div>
          {passed ? <p className={`font-inter text-[1.2rem] font-semibold ${
                passed ? 'text-green-500' : 'text-red-500'
          }`}>Passed!</p> : <p>Failed</p>}
          {data.test_cases.map((item, index) => (
            <div
              key={index}
              className={`p-5 border rounded-md mt-4 font-inter ${
                item.pass ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400'
              }`}
            >
              <p>Expected Output: {item.expected_output}</p>
              <p>Program Output: {item.program_output}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}