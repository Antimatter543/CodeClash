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


dictthing = {("Python", "listint"): "Problems().lintconverter", ("Python", "liststr"): "Problems().lstrconverter",
             ("Python", "int"): "Problems().intconverter", ("Python", "str"): "Problems().strconverter",

             ("Java", "lintconverter"): "JavaProblems.lintconverter",("Java", "liststr"): "JavaProblems.lstrconverter",
             ("Java", "int"): "JavaProblems.intconverter",("Java", "str"): "JavaProblems.strconverter",

             ("C", "lintconverter"): "CProblems.lintconverter",("C", "liststr"): "CProblems.lstrconverter",
             ("C", "int"): "CProblems.intconverter",("C", "str"): "CProblems.strconverter",}

dictquestion = {"119": ("getRow", "int"), "287": ("findDuplicate", "listint"), "557": ("reverseWords", "str"),
                "1048": ("longestStrChain", "liststr"), "1207": ("uniqueOccurrences", "listint")}

## Given by frontend peeps
language_used = "Python"
# user_code = """
# from typing import List
# class Solution:
#     Memo = {}
#     def getRow(self, rowIndex: int) -> List[int]:
#         if rowIndex in self.Memo:
#             return self.Memo[rowIndex]
#         if rowIndex == 0:
#             return [1]
#         ListPrec = self.getRow(rowIndex - 1)
#         Result = [1]
#         for i in range(0, len(ListPrec) - 1):
#             Result.append(ListPrec[i] + ListPrec[i + 1])
#         Result.append(1)
#         self.Memo[rowIndex] = Result
#         return Result
# """ 
# user_code = """
# from typing import List

# class Solution:
#     def findDuplicate(self, nums: List[int]) -> int:
#         slow, fast = 0, 0
#         while True:
#             slow = nums[slow]
#             fast = nums[nums[fast]]
#             if slow == fast:
#                 break

#         slow2 = 0
#         while True:
#             slow = nums[slow]
#             slow2 = nums[slow2]
#             if slow == slow2:
#                 return slow
# """

# user_code = """
# class Solution:
#     def reverseWords(self, s):
#         return " ".join(word[::-1] for word in s.split(" "))
# """

# user_code = """
# class Solution:
#     def longestStrChain(self, words):
#         words.sort(key = len)
#         dp = {}
#         for word in words:
#             dp[word] = 1
#             for i in range(len(word)):
#                 prev = word[:i] + word[i + 1:]
#                 if prev in dp:
#                     dp[word] = max(dp[word], dp[prev] + 1)
#         return max(dp.values())
# """

user_code = """
class Solution:
    def uniqueOccurrences(self, arr):
        from collections import Counter
        cnts = Counter(arr).values()
        return len(cnts) == len(set(cnts))
"""
# Front End gives question number
question = "1207"
question_type = dictquestion[question][1]
# Specify the path to your file
file_path = './questions/readers/python_readers.py'



with open(file_path, 'r') as file:
    file_contents = file.read()
# print(file_contents)

if language_used == "Python":
    judge_code = f"""
{user_code} \n

{file_contents} \n
    
inputs = input()
parsed_input = {dictthing[(language_used, question_type)]}(inputs)

sol = Solution()
print(sol.{dictquestion[question][0]}(parsed_input))
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

# print(input_data, expected_output)

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



