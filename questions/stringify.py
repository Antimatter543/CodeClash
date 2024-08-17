def parse_input_problem1(stdin: str):
    # Example: Single integer input
    x = int(stdin.strip())
    return x

def parse_input_problem2(stdin: str):
    # Example: Two space-separated integers
    a, b = map(int, stdin.strip().split())
    return a, b

def parse_input_problem3(stdin: str):
    # Example: A list of integers in one line
    nums = list(map(int, stdin.strip().split()))
    return nums

# Add more parsers as needed


input_parsers = {
    'problem1': parse_input_problem1,
    'problem2': parse_input_problem2,
    'problem3': parse_input_problem3,
    # Add more mappings as needed
}


import requests

JUDGE0_API_URL = "http://3.24.180.98:2358/submissions/?base64_encoded=false&wait=true"
LANGUAGE_ID = 71  # Python 3.8.1

def submit_code_to_judge0(source_code: str, input_data: str) -> dict:
    payload = {
        "source_code": source_code,
        "language_id": LANGUAGE_ID,
        "stdin": input_data,
        "wait": True
    }
    response = requests.post(JUDGE0_API_URL, json=payload)
    response.raise_for_status()
    return response.json()

def run_test(problem_id: str, stdin: str, source_code: str, expected_output: str):
    # Get the appropriate parser for the problem
    parser = input_parsers[problem_id]
    
    # Parse the input
    parsed_input = parser(stdin)
    print(f"sigma {parsed_input}")
    
    # Modify the source code to integrate the parsed input
    # For simplicity, assume the function name is always f
    # and we format it into the source code
    formatted_code = f"""
def f{parsed_input}:
    return {source_code}

# Run the function and print the result
print(f({parsed_input}))
"""
    
    # Submit the code and get the result
    result = submit_code_to_judge0(formatted_code, stdin)
    print(result)
    actual_output = result.get('stdout', '').strip()
    
    # Compare and print the result
    print(f"Output: {actual_output}")
    print(f"Expected: {expected_output}")
    
    if actual_output == expected_output:
        print("Test PASSED")
    else:
        print("Test FAILED")

# Example usage
stdin = "2"  # Input for problem1
source_code = "return x * 2"  # Example source code to submit
expected_output = "4"  # Expected output
run_test('problem1', stdin, source_code, expected_output)
