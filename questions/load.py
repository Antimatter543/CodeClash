class Solution(object):
    def uniqueOccurrences(self, arr):
        """
        :type arr: List[int]
        :rtype: bool
        """
        from collections import Counter
        cnts = Counter(arr).values()
        return len(cnts) == len(set(cnts))

def process_files(input_file, output_file):
    sol = Solution()
    
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            # Process each line
            arr = list(map(int, line.strip().split(',')))
            result = sol.uniqueOccurrences(arr)
            # Write the result to the output file
            outfile.write(f'{result}\n')

# Specify your input and output file paths
input_file = 'questions/files/1207_test_cases.txt'
output_file = 'output.txt'

# Process the files
process_files(input_file, output_file)
