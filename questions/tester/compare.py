from testcase import generate
from submission import Solution as sub
from answer import Solution as sol

def compare_outputs(correct_output, test_output):
    """Compare two outputs and return True if they match, False otherwise."""
    return correct_output == test_output

def main():
    solution = sol()
    submission = sub()
    
    # Generate the test cases
    test_cases = generate()

    # Write the test cases to a file
    with open("questions/tester/temp/test_cases.txt", "w") as file:
        file.write(test_cases)
    
    test_cases_path = 'questions/tester/temp/test_cases.txt'

    with open(test_cases_path, 'r') as test_file:
        lines = test_file.readlines()

    # Iterate over the lines in pairs
    count_success = 0
    test_case = 0
    for i in range(0, len(lines), 2):
        if i+1 < len(lines):
            test_case += 1
            input_one = lines[i].strip()
            input_two = lines[i+1].strip()
            if input_one and input_two:  # Check if the lines are not empty
                print(f"Testing inputs...\n")
                # print(f"Testing inputs:\nInput One: {input_one}\nInput Two: {input_two}")

                correct_output = solution.minWindow(input_one,input_two)
                test_output = submission.minWindow(input_one,input_two)

                if compare_outputs(correct_output, test_output):
                    count_success += 1
                    print("Output matches.")
                else:
                    print(f"Output mismatch.\n")
                    #print(f"Output mismatch:\nAnswer.py: {correct_output}\nSubmission.py: {test_output}")
    print("Number of Successes: ", count_success, " out of ", test_case," cases")

if __name__ == "__main__":
    main()
