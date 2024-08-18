from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from goated_parser import LANGUAGE_IDS, dictquestion, get_reader, get_judge_code, read_input_file, run_tests, submit_code_to_judge0

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def run_test_cases(language: str, question_number: str, user_code: str) -> list:
    """Run all test cases for a given question and return the results."""
    parser_lang = get_reader(language)
    judge_code = get_judge_code(language, user_code, parser_lang, question_number)

    input_data = read_input_file('./questions/files/' + question_number + '_test_cases.txt')
    expected_output = read_input_file('./questions/files/' + question_number + '_answers.txt')

    results = []

    for i, input_case in enumerate(input_data):
        result = submit_code_to_judge0(language, judge_code, input_case)
        if result.get('stdout') == None:
            case_result = {
                "pass": False,
                "program_output": result.get('stdout'),
                "expected_output": expected_output[i]
            }

            results.append(case_result)
            continue
        
        # If output not none
        actual_output = result.get('stdout', '').strip()
        passed = False

        if language == "Python":
            passed = actual_output == expected_output[i]
        elif language == "Java":
            if expected_output[i] == "True":
                if actual_output == "true":
                    passed = True
            elif expected_output[i] == "False":
                if actual_output == "false":
                    passed = True
            else:
                passed = actual_output == expected_output[i]

            
        case_result = {
            "pass": passed,
            "program_output": actual_output,
            "expected_output": expected_output[i]
        }

        results.append(case_result)

    return results

@app.route('/submit-code', methods=['POST'])
def submit_code():
    data = request.json
    language = data.get('language')
    question_number = data.get('question_number')
    user_code = data.get('user_code')

    if language not in LANGUAGE_IDS:
        return jsonify({"error": "Language not supported"}), 400

    # Run the test cases
    try:
        test_results = run_test_cases(language, question_number, user_code)
        return jsonify({
            "question_number": question_number,
            "total_tests": len(test_results),
            "passed_tests": sum(1 for result in test_results if result["pass"]),
            "test_cases": test_results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
