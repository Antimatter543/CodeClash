import requests
import time

# Your Judge0 API endpoint

## Our public url to the amazon ec2 instance endpoint
url = "http://3.24.180.98:2358/submissions/?base64_encoded=false&wait=true"

# The code you want to run
source_code = """
for i in range(1, 6):
    print(f"Number: {i}")
"""

# The data to send in the POST request
data = {
    "source_code": source_code,
    "language_id": 71  # 71 is for Python 3.8.1
}

# Send the POST request to Judge0
response = requests.post(url, json=data)

# Check if the request was successful
if response.status_code == 201:
    result = response.json()
    # Print the result
    print("Output:\n", result['stdout'])
    print("Errors:\n", result['stderr'])
    print("Status:", result['status']['description'])
else:
    print(f"Failed to submit code: {response.status_code}")
    print(response.json())



# The curl looks like
# curl -X POST "http://<YOUR_PUBLIC_IP>:2358/submissions/?base64_encoded=false&wait=true" \
# -H "Content-Type: application/json" \
# -d '{
#       "source_code": "for i in range(1, 6):\n    print(f\"Number: {i}\")",
#       "language_id": 71
#     }'
