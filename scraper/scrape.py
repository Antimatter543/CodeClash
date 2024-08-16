import requests
from bs4 import BeautifulSoup
import re

# URL to scrape
url = 'https://bishalsarang.github.io/Leetcode-Questions/out.html'

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract raw text from the page
    content = soup.get_text()
    
    # Use regular expressions to split content by lines of asterisks
    # Assuming separators are lines of asterisks
    sections = re.split(r'\n\*+\n', content)
    
    # Process each section
    questions = []
    for section in sections:
        # Strip leading/trailing whitespace and skip empty sections
        section = section.strip()
        if section:
            # Split the section into lines
            lines = section.split('\n')
            if len(lines) > 1:
                question_name = lines[0].strip()
                question_details = '\n'.join(lines[1:]).strip()
                questions.append({'name': question_name, 'details': question_details})
    
    # Print each question and its details
    for q in questions:
        print(f"**{q['name']}**")
        print(q['details'])
        print()

else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
