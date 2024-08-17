from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Judge0 API configuration
JUDGE0_API_URL = "http://3.26.186.241:2358/submissions/?base64_encoded=false&wait=true"
LANGUAGE_IDS = {
    "Python": 71,  # Python 3.8.1
    # Add more languages here if needed
}

def submit_code_to_judge0(language_id: int, source_code: str, input_data: str) -> dict:
    """Submit code to Judge0 and return the response."""
    payload = {
        "source_code": source_code,
        "language_id": language_id,
        "stdin": input_data,
        "wait": True
    }
    response = requests.post(JUDGE0_API_URL, json=payload)
    response.raise_for_status()
    return response.json()

@app.route('/submit-code', methods=['POST'])
def submit_code():
    data = request.json
    language = data.get('language')
    user_code = data.get('user_code')
    input_data = data.get('input_data')

    # Get the corresponding language ID from the dictionary
    language_id = LANGUAGE_IDS.get(language)

    if not language_id:
        return jsonify({"error": "Language not supported"}), 400

    # Submit the code to Judge0
    try:
        result = submit_code_to_judge0(language_id, user_code, input_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)