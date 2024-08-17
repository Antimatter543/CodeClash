import requests

# Judge0 API URL
JUDGE0_API_URL = "http://3.24.180.98:2358/submissions/?base64_encoded=false&wait=true"
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


their_source_code = "print(Hello)"
# Simple function definition
judge0_code = """
{their_source_code}

# Read input from stdin
x = int(input().strip())
# Print the result of f(x)
print(f(x))
"""

# Input value for the function
input_data = "2"

# Expected output (for reference)
expected_output = "4"

# Submit the code and input to Judge0
result = submit_code_to_judge0(judge0_code, input_data)
print(f"Raw result {result}")
# Print the results
print("Output:", result.get('stdout', '').strip())
print("Expected:", expected_output)

# Handle the stderr output safely
stderr_output = result.get('stderr')
if stderr_output:
    print("Errors:", stderr_output.strip())
else:
    print("Errors: None")

print("Execution Status:", result.get('status', {}).get('description', 'Unknown'))

# Compare the output to the expected output
if result.get('stdout', '').strip() == expected_output:
    print("Test PASSED")
else:
    print("Test FAILED")
