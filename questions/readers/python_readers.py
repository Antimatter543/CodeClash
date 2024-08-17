
#### Assume their code will be in 
"""
class Solution:
    Memo = {}

    def func_thing(param1, param2, ...):
"""

# ///
# // Read inputs.
# // Throw inputs into function
# // Print output and compare if their output == expected output (from text file)



from typing import List


class Problems:

    # A bunch of functions, that parse the problem number stdin to the thing that we actually shove into Solution.functhing(param1, ...)
    # Assume the 
    def parse_problem_119(stdin: str) -> int:
        ## Each input is a string of 1,2,3,4,... We want to return a list of integers.
        return int(stdin.strip())
    

    def parse_problem_287(stdin: str) -> List[int]:
        # Takes stuff -> [1,2,3], ...
        words = list(map(int, stdin.strip().split(',')))
        return words,

    def parse_problem_557(stdin: str) -> str:
        return stdin
        
    def parse_problem_1048(stdin: str) -> List[str]:
        # Each line of txt is string with list of words, convert to list[string]
        words = list(map(str, stdin.strip().split(',')))
        return words,

    def parse_problem_1207(stdin: str) -> List[int]:
        # Each line of txt is string with list of int, convert to list[int]
        nums = list(map(int, stdin.strip().split(',')))
        return nums,
