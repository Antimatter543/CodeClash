import requests
from bs4 import BeautifulSoup

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
    
    # Define the path to save the file
    file_path = 'scraper/output.txt'
    
    # Save content to a file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    
    print(f"Content successfully saved to {file_path}")

else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
