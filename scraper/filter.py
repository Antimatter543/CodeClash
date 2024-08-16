import re

# Define the input and output file paths
input_file_path = 'scraper/test.txt'
output_file_path = 'scraper/test_out.txt'

def remove_sequences_of_asterisks(text):
    """
    Remove sequences of three or more consecutive '*' characters from the text.
    
    Parameters:
    - text (str): The input text from which sequences will be removed.
    
    Returns:
    - str: The modified text with the sequences removed.
    """
    # Regular expression to match sequences of three or more '*' characters
    pattern = r'\*{3,}'
    
    # Replace matches with an empty string
    cleaned_text = re.sub(pattern, '~', text)
    
    return cleaned_text

try:
    # Open the input file for reading
    with open(input_file_path, 'r', encoding='utf-8') as infile:
        # Read the entire content of the file
        content = infile.read()
        
        # Remove sequences of three or more '*' characters
        cleaned_content = remove_sequences_of_asterisks(content)
        
        # Open the output file for writing
        with open(output_file_path, 'w', encoding='utf-8') as outfile:
            # Write the cleaned content to the output file
            outfile.write(cleaned_content)
            
    print(f"Cleaned content successfully saved to {output_file_path}")

except FileNotFoundError:
    print(f"Error: The file '{input_file_path}' was not found.")
except IOError as e:
    print(f"Error: An I/O error occurred. {e}")
