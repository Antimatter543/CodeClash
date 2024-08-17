class Solution:
    def longestStrChain(self, words):
        """
        :type words: List[str]
        :rtype: int
        """
        words.sort(key = len)
        dp = {}
        for word in words:
            dp[word] = 1
            for i in range(len(word)):
                prev = word[:i] + word[i + 1:]
                if prev in dp:
                    dp[word] = max(dp[word], dp[prev] + 1)
        return max(dp.values())