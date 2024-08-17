// minWindow
char* judge0_minWindow = "int main() {\n"
                         "    char s[1000], t[1000];\n"
                         "    scanf(\"%s\", s);\n"
                         "    scanf(\"%s\", t);\n"
                         "    printf(\"%s\\n\", minWindow(s, t));\n"
                         "    return 0;\n"
                         "}";

// getRow
char* judge0_getRow = "int main() {\n"
                      "    int rowIndex, returnSize;\n"
                      "    scanf(\"%d\", &rowIndex);\n"
                      "    int* result = getRow(rowIndex, &returnSize);\n"
                      "    for (int i = 0; i < returnSize; i++) {\n"
                      "        printf(\"%d \", result[i]);\n"
                      "    }\n"
                      "    printf(\"\\n\");\n"
                      "    free(result);\n"
                      "    return 0;\n"
                      "}";

// findDuplicate
char* judge0_findDuplicate = "int main() {\n"
                             "    int nums[1000], numsSize;\n"
                             "    scanf(\"%d\", &numsSize);\n"
                             "    for (int i = 0; i < numsSize; i++) {\n"
                             "        scanf(\"%d\", &nums[i]);\n"
                             "    }\n"
                             "    printf(\"%d\\n\", findDuplicate(nums, numsSize));\n"
                             "    return 0;\n"
                             "}";

// reverseWords
char* judge0_reverseWords = "int main() {\n"
                            "    char s[1000];\n"
                            "    fgets(s, sizeof(s), stdin);\n"
                            "    printf(\"%s\\n\", reverseWords(s));\n"
                            "    return 0;\n"
                            "}";

// longestStrChain
char* judge0_longestStrChain = "int main() {\n"
                               "    char words[100][100];\n"
                               "    int wordsSize;\n"
                               "    scanf(\"%d\", &wordsSize);\n"
                               "    for (int i = 0; i < wordsSize; i++) {\n"
                               "        scanf(\"%s\", words[i]);\n"
                               "    }\n"
                               "    char* wordArray[100];\n"
                               "    for (int i = 0; i < wordsSize; i++) {\n"
                               "        wordArray[i] = words[i];\n"
                               "    }\n"
                               "    printf(\"%d\\n\", longestStrChain(wordArray, wordsSize));\n"
                               "    return 0;\n"
                               "}";

// uniqueOccurrences
char* judge0_uniqueOccurrences = "int main() {\n"
                                 "    int arr[1000], arrSize;\n"
                                 "    scanf(\"%d\", &arrSize);\n"
                                 "    for (int i = 0; i < arrSize; i++) {\n"
                                 "        scanf(\"%d\", &arr[i]);\n"
                                 "    }\n"
                                 "    printf(\"%d\\n\", uniqueOccurrences(arr, arrSize));\n"
                                 "    return 0;\n"
                                 "}";
