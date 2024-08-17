import requests
import os
from typing import List, Tuple
import json

# Constants
JUDGE0_API_URL = "http://3.24.180.98/2358/submissions/"
LANGUAGE_ID = 71  # Python 3.8.1
TESTCASES_DIR = "./testcases/problem1/"
WAIT_FOR_RESULT = True
BASE64_ENCODED = False

def format_input(input_str: str) -> str:
    """Format the input string to a Python function call."""
    nums_str, target_str = input_str.split(']')
    nums = json.loads(nums_str + ']')
    target = int(target_str.strip())
    return f"print(two_sum({nums}, {target}))"

def read_test_cases(input_file: str, output_file: str):
    """Read all lines from input and output files."""
    with open(input_file, 'r') as infile, open(output_file, 'r') as outfile:
        input_lines = infile.readlines()
        output_lines = outfile.readlines()
        return list(zip(input_lines, output_lines))

def submit_code_to_judge0(source_code: str) -> dict:
    """Submit code to Judge0 and return the response."""
    payload = {
        "source_code": source_code,
        "language_id": LANGUAGE_ID,
        "base64_encoded": BASE64_ENCODED,
        "wait": WAIT_FOR_RESULT
    }
    response = requests.post(JUDGE0_API_URL, json=payload)
    response.raise_for_status()  # Raises an exception for HTTP errors
    return response.json()

def compare_outputs(actual_output: str, expected_output: str) -> bool:
    """Compare the actual output with the expected output."""
    return actual_output.strip() == expected_output.strip()

def run_tests(input_file: str, output_file: str) -> None:
    """Run all test cases and print the results."""
    test_cases = read_test_cases(input_file, output_file)
    for index, (input_case, expected_output) in enumerate(test_cases):
        formatted_input = format_input(input_case.strip())
        source_code = f"""
def two_sum(nums, target):
    num_map = {{}}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

{formatted_input}
"""
        result = submit_code_to_judge0(source_code)
        actual_output = result.get('stdout', '')

        if compare_outputs(actual_output, expected_output):
            print(f"Test case {index + 1} PASSED")
        else:
            print(f"Test case {index + 1} FAILED")
            print(f"Input: {input_case.strip()}")
            print(f"Expected: {expected_output.strip()}")
            print(f"Got: {actual_output.strip()}")

if __name__ == "__main__":
    input_file_path = os.path.join(TESTCASES_DIR, "input.txt")
    output_file_path = os.path.join(TESTCASES_DIR, "output.txt")
    run_tests(input_file_path, output_file_path)