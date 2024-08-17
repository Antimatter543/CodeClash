import requests

# Judge0 API URL
JUDGE0_API_URL = "http://3.26.186.241:2358/submissions/?base64_encoded=false&wait=true"

# LANGUAGE_ID = 71  # Python 3.8.1
# LANGUAGE_ID = 62  # Java
LANGUAGE_ID = 75 # C

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

             ("Java", "listint"): "JavaProblems.lintconverter",("Java", "liststr"): "JavaProblems.lstrconverter",
             ("Java", "int"): "JavaProblems.intconverter",("Java", "str"): "JavaProblems.strconverter",

             ("C", "lintconverter"): "CProblems.lintconverter",("C", "liststr"): "CProblems.lstrconverter",
             ("C", "int"): "CProblems.intconverter",("C", "str"): "CProblems.strconverter",}

dictquestion = {"119": ("getRow", "int", "int", "int"), "287": ("findDuplicate", "listint", "int[]", "int*"), "557": ("reverseWords", "str", "String", "char*"),
                "1048": ("longestStrChain", "liststr", "String[]", "char**"), "1207": ("uniqueOccurrences", "listint", "int[]", "int*")}

## Given by frontend peeps
# language_used = "Python"
language_used = "C"
# All java code needs to be static
user_code = """
int* getRow(int rowIndex, int* returnSize) {
    *returnSize = rowIndex + 1;
    int *triangle = malloc(*returnSize * sizeof(int));

    for (int i = 0; i < *returnSize; i++) {
        int last = 1;
        for (int ii = 1; ii < i; ii++) {
            int tmp = triangle[ii];
            triangle[ii] += last;
            last = tmp;
        }
        triangle[i] = 1;
    }

    return triangle;
}
"""
# Front End gives question number
question = "119"
question_type = dictquestion[question][1]
# Specify the path to your file
# file_path = './questions/readers/python_readers.py'
# file_path = './questions/readers/JavaProblems.java'
file_path = './questions/readers/CProblems.c'



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
elif language_used == "Java":
    judge_code = f"""
    import java.util.*;

    {file_contents}
    public class Main {{
        {user_code}
        public static void main(String[] args) {{
            // Read input using Scanner
            Scanner scanner = new Scanner(System.in);
            String inputs = scanner.nextLine();
            
            // Parse input using the corresponding converter function
            {dictquestion[question][2]} parsed_input = {dictthing[(language_used, question_type)]}(inputs);
            System.out.println({dictquestion[question][0]}(parsed_input));
        }}
    }}
    """
elif language_used == "C":
    judge_code = f"""
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    // Function declarations
    {user_code}
    {file_contents}

    // Function prototypes
    int* lintconverter(const char* stdin, int* size);
    char** lstrconverter(const char* stdin, int* size);
    int intconverter(const char* stdin);
    char* strconverter(const char* stdin);

    int main() {{
        // Read input
        char input_buffer[1024];
        fgets(input_buffer, sizeof(input_buffer), stdin);

        // Assuming the function to call is getRow and it requires rowIndex and returnSize
        int returnSize;
        int rowIndex = intconverter(input_buffer);  // Convert input to integer

        // Call the function and get the result
        int* result = getRow(rowIndex, &returnSize);

        // Print the result
        printf("[");
        for (int i = 0; (i - 1) < returnSize; i++) {{
            printf("%d, ", result[i]);
        }}
        printf("]\\n");

        // Free allocated memory
        free(result);

        return 0;
    }}
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
    if language_used == "Java" and expected_output[i] == "True":
        if result.get('stdout', '').strip() == "true":
            print("Test PASSED")
        else:
            print("Test FAILED")
    elif language_used == "Java" and expected_output[i] == "False":
        if result.get('stdout', '').strip() == "false":
            print("Test PASSED")
        else:
            print("Test FAILED")
    elif result.get('stdout', '').strip() == expected_output[i]:
        print("Test PASSED")
    else:
        print("Test FAILED")



