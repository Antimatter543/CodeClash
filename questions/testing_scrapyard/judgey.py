import requests

# Judge0 API URL
JUDGE0_API_URL = "http://3.26.186.241:2358/submissions/?base64_encoded=false&wait=true"

# LANGUAGE_ID = 71  # Python 3.8.1
LANGUAGE_ID = 62  # Java

def submit_code_to_judge0(source_code: str, input_data: str) -> dict:
    """Submit code to Judge0 with input and return the response."""
    payload = {
        "source_code": source_code,
        "language_id": LANGUAGE_ID,
        "stdin": input_data,
        "wait": True
    }
    response = requests.post(JUDGE0_API_URL, json=payload)
    response.raise_for_status()
    return response.json()


dictthing = {("Python", "listint"): "Problems().lintconverter", ("Python", "liststr"): "Problems().lstrconverter",
             ("Python", "int"): "Problems().intconverter", ("Python", "str"): "Problems().strconverter",

             ("Java", "listint"): "JavaProblems.lintconverter",("Java", "liststr"): "JavaProblems.lstrconverter",
             ("Java", "int"): "JavaProblems.intconverter",("Java", "str"): "JavaProblems.strconverter",

             ("C", "lintconverter"): "CProblems.lintconverter",("C", "liststr"): "CProblems.lstrconverter",
             ("C", "int"): "CProblems.intconverter",("C", "str"): "CProblems.strconverter",}

dictquestion = {"119": ("getRow", "int", "int"), "287": ("findDuplicate", "listint", "int[]"), "557": ("reverseWords", "str", "String"),
                "1048": ("longestStrChain", "liststr", "String[]"), "1207": ("uniqueOccurrences", "listint", "int[]")}

## Given by frontend peeps
# language_used = "Python"
language_used = "Java"
# All java code needs to be static
# user_code = """
# public static List<Integer> getRow(int rowIndex) {
#     Integer[] ans = new Integer[rowIndex + 1];
#     Arrays.fill(ans, 1);

#     for (int i = 2; i < rowIndex + 1; ++i)
#         for (int j = 1; j < i; ++j)
#             ans[i - j] += ans[i - j - 1];

#     return Arrays.asList(ans);
# }
# """
# user_code = """
# public static int findDuplicate(int[] nums) {
#     int slow = nums[nums[0]];
#     int fast = nums[nums[nums[0]]];

#     while (slow != fast) {
#       slow = nums[slow];
#       fast = nums[nums[fast]];
#     }

#     slow = nums[0];

#     while (slow != fast) {
#       slow = nums[slow];
#       fast = nums[fast];
#     }

#     return slow;
# }
# """
# user_code = """
# public static String reverseWords(String s) {
#     if (s == null || s.length() <= 1) {
#         return s;
#     }
#     char[] str = s.toCharArray();
#     int start = 0;
#     for (int i = 0; i < str.length; i++) {
#         if (str[i] == ' ') {
#             reverse(str, start, i - 1);
#             start = i + 1;
#         } else if (i == str.length - 1) {
#             reverse(str, start, i);
#         }
#     }//end for
    
#     return String.valueOf(str);
# }

# public static void reverse(char[] s, int start, int end) {
#     while (start < end) {
#         char temp = s[start];
#         s[start] = s[end];
#         s[end] = temp;
#         start++;
#         end--;
#     }
# }
# """
# user_code = """
# public static int longestStrChain(String[] words) {
#     int rst = 0;
#     Arrays.sort(words, Comparator.comparing(a -> a.length()));
#     HashMap<String, Integer> wordChainMap = new HashMap();
#     for (String word : words) {
#         if (wordChainMap.containsKey(word)) continue;
#         wordChainMap.put(word, 1);
#         for (int i = 0; i < word.length(); i++) {
#             StringBuilder sb = new StringBuilder(word);
#             sb.deleteCharAt(i);
#             String lastWord = sb.toString();
#             if (wordChainMap.containsKey(lastWord) && wordChainMap.get(lastWord) + 1 > wordChainMap.get(word)) {
#                 wordChainMap.put(word, wordChainMap.get(lastWord) + 1);
#             }
#         }
#         if (wordChainMap.get(word) > rst) rst = wordChainMap.get(word);
#     }
#     return rst;
# }   
# """
user_code = """
public static boolean uniqueOccurrences(int[] arr) {
    Map<Integer, Integer> count = new HashMap<>();
    Set<Integer> occurrences = new HashSet<>();

    for (final int a : arr)
      count.merge(a, 1, Integer::sum);

    for (final int value : count.values())
      if (!occurrences.add(value))
        return false;

    return true;
}
"""
# Front End gives question number
question = "1207"
question_type = dictquestion[question][1]
# Specify the path to your file
# file_path = './questions/readers/python_readers.py'
file_path = './questions/readers/JavaProblems.java'



with open(file_path, 'r') as file:
    file_contents = file.read()
# print(file_contents)

if language_used == "Python":
    judge_code = f"""
    {user_code} \n

    {file_contents} \n
        
    inputs = input()
    parsed_input = {dictthing[(language_used, question_type)]}(inputs)

    sol = Solution()
    print(sol.{dictquestion[question][0]}(parsed_input))
    """
elif language_used == "Java":
    judge_code = f"""
    import java.util.*;

    {file_contents}
    public class Main {{
        {user_code}
        public static void main(String[] args) {{
            // Read input using Scanner
            Scanner scanner = new Scanner(System.in);
            String inputs = scanner.nextLine();
            
            // Parse input using the corresponding converter function
            {dictquestion[question][2]} parsed_input = {dictthing[(language_used, question_type)]}(inputs);
            System.out.println({dictquestion[question][0]}(parsed_input));
        }}
    }}
    """

# print(judge_code)

def read_input_file(file_path: str) -> list:
    """Read a file and return its contents as a list of strings, each line as an element."""
    with open(file_path, 'r') as file:
        lines = file.readlines()
        # Strip newline characters from each line
        lines = [line.strip() for line in lines]
    return lines


input_data = read_input_file('./questions/files/'+ question +'_test_cases.txt')
expected_output = read_input_file('./questions/files/'+ question +'_answers.txt')

# print(input_data, expected_output)

### Throw it to judge, and handle the result

# Submit the code and input to Judge0
for i in range(len(input_data)):

    result = submit_code_to_judge0(judge_code, input_data[i])
    print(f"Raw result {result}")
    # Print the results
    print("Output:", result.get('stdout', '').strip())
    print("Expected:", expected_output[i])

    # Handle the stderr output safely
    stderr_output = result.get('stderr')
    if stderr_output:
        print("Errors:", stderr_output.strip())
    else:
        print("Errors: None")

    print("Execution Status:", result.get('status', {}).get('description', 'Unknown'))

    # Compare the output to the expected output
    if language_used == "Java" and expected_output[i] == "True":
        if result.get('stdout', '').strip() == "true":
            print("Test PASSED")
        else:
            print("Test FAILED")
    elif language_used == "Java" and expected_output[i] == "False":
        if result.get('stdout', '').strip() == "false":
            print("Test PASSED")
        else:
            print("Test FAILED")
    elif result.get('stdout', '').strip() == expected_output[i]:
        print("Test PASSED")
    else:
        print("Test FAILED")



