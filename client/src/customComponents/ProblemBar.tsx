export default function ProblemBar() {
    // Define a static Problem object
    const problem = {
        title: "Two Sum",
        details: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
            {
                input: "nums = [2, 7, 11, 15], target = 9",
                output: "[0, 1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3, 2, 4], target = 6",
                output: "[1, 2]",
                explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
            },
            {
                input: "nums = [3, 3], target = 6",
                output: "[0, 1]",
                explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ]
    };

    return (
        <div className="flex flex-col h-screen font-inter py-5 px-10 gap-5 overflow-y-auto">
            <section>
                <h1 className="font-inter font-semibold text-[1.2rem]">
                    {problem.title}
                </h1>
                <p className="font-inter text-[0.8rem] mt-2">{problem.details}</p>
            </section>
        
            <section>
                <h2 className="font-inter font-bold text-[0.9rem] mt-4">Examples:</h2>
                <ul className="font-inter text-[0.8rem] mt-2 flex flex-col gap-3 b">
                    {problem.examples.map((example, index) => (
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
                    {problem.constraints.map((constraint, index) => (
                        <li key={index}>* {constraint}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}