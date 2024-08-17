class Solution:
    def uniqueOccurrences(self, arr):
        """
        :type arr: List[int]
        :rtype: bool
        """
        from collections import Counter
        cnts = Counter(arr).values()
        return len(cnts) == len(set(cnts))