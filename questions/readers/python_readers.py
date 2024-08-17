from typing import List


class Problems:
    def lintconverter(self, stdin: str) -> List[int]:
        nums = list(map(int, stdin.strip().split(',')))
        return nums
    
    def lstrconverter(self, stdin: str) -> List[str]:
        words = list(map(str, stdin.strip().split(',')))
        return words

    def intconverter(self, stdin: str) -> int:
        return int(stdin.strip())

    def strconverter(self, stdin: str) -> str:
        return stdin