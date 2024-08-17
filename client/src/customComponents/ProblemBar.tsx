interface ProblemBarProps {
    problem: any
}

export default function ProblemBar({problem}: ProblemBarProps) {
    return (
        <div className="h-screen">
            {problem && 
                <div className="flex flex-col h-full font-inter py-5 px-10 gap-5 overflow-y-auto">
                    <section>
                        <h1 className="font-inter font-semibold text-[1.2rem]">
                            {problem.title}
                        </h1>
                        <p className="font-inter text-[0.8rem] mt-2">{problem.details}</p>
                    </section>
                
                    <section>
                        <h2 className="font-inter font-bold text-[0.9rem] mt-4">Examples:</h2>
                        <ul className="font-inter text-[0.8rem] mt-2 flex flex-col gap-3 b">
                            {problem.examples.map((example: any, index: number) => (
                                <li className="bg-neutral-200 p-5 rounded-md" key={index}>
                                    <strong>Input:</strong> {example.input} <br/>
                                    <strong>Output:</strong> {example.output} <br />
                                    <strong>Explanation:</strong> {example.explanation}
                                </li>
                            ))}
                        </ul>
                    </section>
                    
                    <section>
                        <h2 className="font-inter font-bold text-[0.9rem] mt-4">Constraints:</h2>
                        <ul className="font-inter text-[0.8rem] mt-2">
                            {problem.constraints.map((constraint: string, index: number) => (
                                <li key={index}>* {constraint}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            }
        </div>
        
    );
}