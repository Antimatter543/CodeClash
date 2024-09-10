![image](https://github.com/user-attachments/assets/9b8915a2-e62b-4a84-93b6-164e91613e6a)WIP -- Anti is making this look better (5/9/24):
- Pretty up README, having it ordered and make sense (add some diagrams?)
- Make a short video about actually going through the project and showcasing a game.
- Writing a blogpost for it

Will be done by: Who knows :D 
## Intro
Ever wanted to get better at competitive programming, but found leetcoding by yourself too boring?

Play CodeDuel! Now, you can vs a friend with questions, and sabotage their code!

![image](https://github.com/user-attachments/assets/1a33d2a2-5c4b-4b73-8296-4aae06d257ee)

![image](https://github.com/user-attachments/assets/f9eb4b49-52da-4ecd-9ed7-85a78b3a06d7)



## AWS Backend Stuff
- Run the docker for judge0 execution
- From `cd CodeClash`, do `python3 aws_backend/app.py` to run the flask app.
- To use testscript, change the LOCAL variable depending on if you're using a server or hosting app locally, and then `python3 aws_backend/testscript.py` from the CodeClash directory.


### LeetCode Questions
### Scraper
Used modules request and BeautifulSoup to scrape this website:
- https://bishalsarang.github.io/Leetcode-Questions/out.html
Bishalsarang on GitHub updates this webpage with leetcode questions every day, so thanks to them we have easy to access questions.

### Solutions (Multi-Language)
Used Open-Source solutions to save Python and Java solutions on the server.
- https://github.com/neetcode-gh/leetcode/tree/main/python
- https://github.com/qinhanmin2014/LeetCode-solutions/blob/master/Python/1207.md
All the questions used are stored in a .json file for use in our website.

### Figuring out Test Cases
This was difficult because test cases are not open source, and every tech company is holding off their resources.
This issue can be summarised by the Owner of LeetCode from a while back.
![image](https://github.com/user-attachments/assets/004ff504-c3e7-489d-aba9-fcce19587462)

So, we used an open-source LeetCode test case generator, where each question has its own generate_test_case function.


**How to generate test cases:** https://github.com/darshansharma/leetcode-testcase-generator

For the sake of saving performance on our server and for simplicity sake, we generated one set of test cases for every question, and tested the code on every perfect leetcode answer.
The output is saved in a txt file, each test cases seperated by a new line. 

#### Language Support (Python and Java)
Basically, Docker is on the AWS server, it hosts Judge0 which will compile, run and output results of any given code and our local machines can interpret the output from the run code. Judge0 requires a string in the requested coding language, and must contain a way to output to stdout. Because we have test cases, we input the expected answers into stdin and each language will have to read through each line to test the test cases.
![image](https://github.com/user-attachments/assets/a354dba0-fa67-47db-97d4-6846ff569cc7)
![image](https://github.com/user-attachments/assets/db76258a-96ae-4974-9531-7457ec9c41f7)

Judge0 will return a .json format output which looks like this:
![image](https://github.com/user-attachments/assets/38a60e62-4d8f-43b3-a942-a5367ac14f0a)
And will be interpreted by each user's machine.




