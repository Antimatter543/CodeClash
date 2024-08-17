import requests

# Configuration
API_URL = "http://127.0.0.1:5000/submit-code"
USER_CODE_FILE = "../questions/solutions/1207.py"

# Read user code from file
with open(USER_CODE_FILE, 'r') as file:
    user_code = file.read()

print(user_code)
# Prepare the data to be sent in the POST request
data = {
    "language": "Python",
    "question_number": "1207",
    "user_code": user_code
}

# Send the POST request
response = requests.post(API_URL, json=data)

# Print the response from the server
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
 