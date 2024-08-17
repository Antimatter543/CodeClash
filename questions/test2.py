import requests
import json

# Your code to submit
source_code = """
def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

import sys
import json

# Read input from stdin
data = json.loads(sys.stdin.read())
nums = data['nums']
target = data['target']

# Run the function and print the result
print(two_sum(nums, target))
"""

# Input data
input_data = {
    "nums": [2, 7, 11, 15],
    "target": 9
}

# Prepare the payload
payload = {
    "source_code": source_code,
    "language_id": 71,  # Python 3.8.1
    "stdin": json.dumps(input_data),
    "wait": True
}

JUDGE0_API_URL = "http://3.24.180.98/2358/submissions/"
# Submit to Judge0
response = requests.post(JUDGE0_API_URL, json=payload)
result = response.json()

# Print the result
print("Output:", result['stdout'])
print("Expected:", "[0, 1]")  # Expected output for comparison
