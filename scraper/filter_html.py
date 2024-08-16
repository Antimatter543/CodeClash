import re

def remove_pattern_from_file(input_filename, output_filename):
    try:
        with open(input_filename, 'r', encoding='utf-8') as file:
            content = file.read()

        # Use a regular expression to remove content between `pre{` and `~`, keeping `~`
        pattern = re.compile(r'pre\{.*?(?=\~)', re.DOTALL)
        modified_content = pattern.sub('', content)

        with open(output_filename, 'w', encoding='utf-8') as file:
            file.write(modified_content)

    except Exception as e:
        print(f"An error occurred: {e}")
        # Handle any additional error recovery or logging if needed

# Example usage
remove_pattern_from_file('scraper/no_ass.txt', 'scraper/leetcode.txt')
