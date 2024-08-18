import requests
from constants import * 
# Configuration

#### THIS SENDS REQUESTS TO APP.PY HOSTED ON THE EC2 INSTANCE, NOT THE ACTUAL JUDGE THING!!!


LOCAL = True
if LOCAL:
    API_URL = "http://127.0.0.1:5000/submit-code"
else:
    API_URL = f"http://{EC2_IP}:5000/submit-code"


QUESTION_NUMBER = "119"
USER_CODE_FILE = f"./questions/solutions/Java/{QUESTION_NUMBER}.java"

# Read user code from file
with open(USER_CODE_FILE, 'r') as file:
    user_code = file.read()

print(user_code)
# Prepare the data to be sent in the POST request
data = {
    "language": "Java",
    "question_number": f"{QUESTION_NUMBER}",
    "user_code": user_code
}

# Send the POST request
response = requests.post(API_URL, json=data)

# Print the response from the server
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
 
