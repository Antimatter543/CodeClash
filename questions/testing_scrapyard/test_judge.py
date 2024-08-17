import requests

# Judge0 API URL
JUDGE0_API_URL = "http://13.211.75.177:2358/submissions/?base64_encoded=false&wait=true"

LANGUAGE_ID = 71  # Python 3.8.1

def submit_code_to_judge0(source_code: str, input_data: str) -> dict:
    """Submit code to Judge0 with input and return the response."""
    payload = {
        "source_code": source_code,
        "language_id": LANGUAGE_ID,
        "stdin": input_data,
        "wait": True
    }
    response = requests.post(JUDGE0_API_URL, json=payload)
    response.raise_for_status()
    return response.json()


dictthing = {("Python", "listint"): "Problems().lintconverter", ("Python, liststr"): "Problems().lstrconverter",
             ("Python", "int"): "Problems().intconverter", ("Python, str"): "Problems().strconverter",

             ("Java", "lintconverter"): "JavaProblems.lintconverter",("Java", "liststr"): "JavaProblems.lstrconverter",
             ("Java", "int"): "JavaProblems.intconverter",("Java", "str"): "JavaProblems.strconverter",

             ("C", "lintconverter"): "CProblems.lintconverter",("C", "liststr"): "CProblems.lstrconverter",
             ("C", "int"): "CProblems.intconverter",("C", "str"): "CProblems.strconverter",}

dictquestion = {"76": "minWindow", "119": "getRow", "287": "findDuplicate", "557": "reverseWords",
                "1048": "longestStrChain", "1207": "uniqueOccurrences"}

## Given by frontend peeps
language_used = "Python"
user_code = """
from typing import List
class Solution:
    Memo = {}

    def getRow(self, rowIndex: int) -> List[int]:
        if rowIndex in self.Memo:
            return self.Memo[rowIndex]
        if rowIndex == 0:
            return [1]
        ListPrec = self.getRow(rowIndex - 1)
        Result = [1]
        for i in range(0, len(ListPrec) - 1):
            Result.append(ListPrec[i] + ListPrec[i + 1])
        Result.append(1)
        self.Memo[rowIndex] = Result
        return Result
""" 
# Specify the path to your file
file_path = './questions/readers/python_readers.py'

# hard coding the type of question
question = "119"
with open(file_path, 'r') as file:
    file_contents = file.read()
# print(file_contents)

if language_used == "Python":
    judge_code = f"""
{user_code} \n

{file_contents} \n
    
inputs = input()
parsed_input = {dictthing[(language_used, "int")]}(inputs)


sol = Solution()
print(sol.{dictquestion[question]}(parsed_input))
"""

# print(judge_code)

def read_input_file(file_path: str) -> list:
    """Read a file and return its contents as a list of strings, each line as an element."""
    with open(file_path, 'r') as file:
        lines = file.readlines()
        # Strip newline characters from each line
        lines = [line.strip() for line in lines]
    return lines


input_data = read_input_file('./questions/files/'+ question +'_test_cases.txt')
expected_output = read_input_file('./questions/files/'+ question +'_answers.txt')

print(input_data, expected_output)

### Throw it to judge, and handle the result

# Submit the code and input to Judge0
for i in range(len(input_data)):

    result = submit_code_to_judge0(judge_code, input_data[i])
    print(f"Raw result {result}")
    # Print the results
    print("Output:", result.get('stdout', '').strip())
    print("Expected:", expected_output[i])

    # Handle the stderr output safely
    stderr_output = result.get('stderr')
    if stderr_output:
        print("Errors:", stderr_output.strip())
    else:
        print("Errors: None")

    print("Execution Status:", result.get('status', {}).get('description', 'Unknown'))

    # Compare the output to the expected output
    if result.get('stdout', '').strip() == expected_output[i]:
        print("Test PASSED")
    else:
        print("Test FAILED")



