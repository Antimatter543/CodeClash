import requests

from constants import *
# Judge0 API URL
LANGUAGE_ID = 71  # Python 3.8.1


LANGUAGE_IDS = {
    "Python": 71,
    "Java": 62,
    "C": 50,
}
dictthing = {("Python", "listint"): "Problems().lintconverter", ("Python", "liststr"): "Problems().lstrconverter",
             ("Python", "int"): "Problems().intconverter", ("Python", "str"): "Problems().strconverter",

             ("Java", "listint"): "JavaProblems.lintconverter",("Java", "liststr"): "JavaProblems.lstrconverter",
             ("Java", "int"): "JavaProblems.intconverter",("Java", "str"): "JavaProblems.strconverter",

             ("C", "lintconverter"): "CProblems.lintconverter",("C", "liststr"): "CProblems.lstrconverter",
             ("C", "int"): "CProblems.intconverter",("C", "str"): "CProblems.strconverter",}
dictquestion = {
    "119": ("getRow", "int", "int"),
    "287": ("findDuplicate", "listint", "int"),
    "557": ("reverseWords", "str", "String"),
    "1048": ("longestStrChain", "liststr", "String[]"),
    "1207": ("uniqueOccurrences", "listint", "int[]"),
}

def submit_code_to_judge0(language: str, source_code: str, input_data: str) -> dict:
    """Submit code to Judge0 with input and return the response.
    language is like "Python"
    """
    payload = {
        "source_code": source_code,
        "language_id": LANGUAGE_IDS[language],
        "stdin": input_data,
        "wait": True
    }
    response = requests.post(JUDGE0_API_URL, json=payload)
    response.raise_for_status()
    return response.json()

def get_reader(language) -> str:
    # Gets the string from the stuff in /readers for the corresponding language
    file_contents = ""
    if language == "Python":
        file_path = './questions/readers/python_readers.py' ## Readers is the reader for language..
    elif language == "Java":
        file_path = './questions/readers/JavaProblems.java' ## Readers is the reader for language..
    else:
        print("What are you doing we haven't done this language i gave up no thanks")
        return None
    
    with open(file_path, 'r') as file:
        file_contents = file.read()
    return file_contents



def get_judge_code(language: str, user_code: str, parser_lang: str, question_number):
    
    if language == "Python":
        func_name, question_type, _ = dictquestion[question_number]
        judge_code = f"""
{user_code} \n
{parser_lang} \n
    
inputs = input()
parsed_input = {dictthing[(language, question_type)]}(inputs)

sol = Solution()
print(sol.{func_name}(parsed_input))
    """
    elif language == "Java":
        func_name, question_type, typey = dictquestion[question_number]
        judge_code = f"""
    import java.util.*;
    {parser_lang}
    public class Main {{
        {user_code}
        public static void main(String[] args) {{
            // Read input using Scanner
            Scanner scanner = new Scanner(System.in);
            String inputs = scanner.nextLine();
            
            // Parse input using the corresponding converter function
            {typey} parsed_input = {dictthing[(language, question_type)]}(inputs);
            System.out.println({func_name}(parsed_input));
        }}
    }}
    """
    return judge_code



def read_input_file(file_path: str) -> list:
    """Read a file and return its contents as a list of strings, each line as an element."""
    with open(file_path, 'r') as file:
        lines = file.readlines()
        # Strip newline characters from each line
        lines = [line.strip() for line in lines]
    return lines


# print(input_data, expected_output)

### Throw it to judge, and handle the result

# Submit the code and input to Judge0
def run_tests(language: str, judge_code: str, input_data: list, expected_output: list):
        
    for i in range(len(input_data)):

        result = submit_code_to_judge0(language, judge_code, input_data[i])
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


###################### CODEEEEEEEEEEEEEEEEE ###########

# ### Data given by FRONTEND
# language_used = "Python"
# question_number = "287"
# user_code = ""
# ########################## DATA ABOVE GIVEN BY FRONTEND!!

# # The below is available to receive.

# with open(f"./questions/solutions/{question_number}.py", 'r') as file:
#         user_code = file.read() ## Instead of this the code would be given by the text in the IDE but yeah..
# # user_code = """
# # class Solution:
# #     def uniqueOccurrences(self, arr):
# #         from collections import Counter
# #         cnts = Counter(arr).values()
# #         return len(cnts) == len(set(cnts))
# # """


# parser_lang = get_reader(language_used)
# ### JUDGE CODE 

# judge_code = get_judge_code(language_used, user_code, parser_lang, question_number)
# # print(judge_code)


# input_data = read_input_file('./questions/files/'+ question_number +'_test_cases.txt')
# expected_output = read_input_file('./questions/files/'+ question_number +'_answers.txt')

# run_tests(language_used, judge_code, input_data, expected_output)
