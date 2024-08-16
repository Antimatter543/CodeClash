import json

def process_file(file_path):
    # Read the file content
    with open(file_path, 'r') as file:
        content = file.read()

    # Split based on the delimiter '~'
    cells = content.split('~')

    # Ignore the first cell (empty) and process in pairs
    problems = []
    for i in range(1, len(cells) - 1, 2):
        title = cells[i].strip()
        body = cells[i + 1].strip()

        # Split body into description, examples, and constraints
        description = []
        examples = []
        constraints = []
        
        example_started = False
        constraints_started = False
        example_block = {}
        
        for line in body.split('\n'):
            line = line.strip()

            if "Example" in line:
                example_started = True
                example_block = {}  # Reset for new example
                continue

            if "Constraint" in line:
                example_started = False
                constraints_started = True
                continue

            if example_started:
                if line.startswith("Input:"):
                    if example_block:
                        examples.append(example_block)  # Save the previous example
                    example_block = {"input": line.replace("Input: ", "")}
                elif line.startswith("Output:"):
                    example_block["output"] = line.replace("Output: ", "")
                elif line.startswith("Explanation:"):
                    example_block["explanation"] = line.replace("Explanation: ", "")
            elif constraints_started:
                constraints.append(line)
            else:
                description.append(line)

        # Append the last example
        if example_block:
            examples.append(example_block)

        # Combine everything into the problem object
        problem = {
            "title": title,
            "details": " ".join(description),
            "examples": examples,
            "constraints": constraints
        }
        problems.append(problem)

    return problems

def save_to_json(problems, output_path):
    with open(output_path, 'w') as json_file:
        json.dump(problems, json_file, indent=4)

# Example usage:
file_path = 'scraper/test.txt'
output_path = 'scraper/test_out.json'

problems = process_file(file_path)
save_to_json(problems, output_path)

print(f"Processed and saved {len(problems)} problems to {output_path}.")
