"""from typing import List


class Solution:
    Memo = {}

    def getRow(self, rowIndex: int) -> List[int]:
        if rowIndex in self.Memo:
            return self.Memo[rowIndex]
        if rowIndex == 0:
            return [1]
        ListPrec = self.getRow(rowIndex - 1)
        Result = [1]
        for i in range(0, len(ListPrec) - 1):
            Result.append(ListPrec[i] + ListPrec[i + 1])
        Result.append(1)
        self.Memo[rowIndex] = Result
        return Result
"""

dictthing = {("Python", "listint"): "Problems.lintconverter", ("Python, liststr"): "Problems.lstrconverter",
             ("Python", "int"): "Problems.intconverter", ("Python, str"): "Problems.strconverter",
             ("Java", "strconverter"): "JavaProblems.strconverter"}

if python:
    judge= """{string}

    {readers file}

    // get stdin

    parsed_input = {dictthing["Python", "listint")}(stdin)  }
    sol = Solution()
    print(sol.getRow(parsed_input))
    """
if java:
    judge = """
    {java string}

    {java reader}

    var parsed_input = {dictthing[("Java", lstrconverter]} 
    Sol solution = Sol() 
    systems.tsloitut(solution.getRow(parsed_input))
    """
if c:
 judge = """...."""


dict["language", "listint"] = 

func = dict["language", "listint"] 

parsed_input = func(stdin)
sol = Solution()
print(sol.getRow(parsed_input))
"
// send to judge and get output string

// compare judge output to answers.txt output