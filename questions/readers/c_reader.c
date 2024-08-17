#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function to convert a comma-separated string to an array of integers
void lintconverter(const char* stdin_str, int* nums, int* size) {
    char* token;
    char* stdin_copy = strdup(stdin_str);
    int index = 0;

    token = strtok(stdin_copy, ",");
    while (token != NULL) {
        nums[index++] = atoi(token);
        token = strtok(NULL, ",");
    }

    *size = index;
    free(stdin_copy);
}

// Function to convert a string to an integer
int strintconverter(const char* stdin_str) {
    return atoi(stdin_str);
}

// Function to convert a comma-separated string to an array of strings
void lstrconverter(const char* stdin_str, char words[][100], int* size) {
    char* token;
    char* stdin_copy = strdup(stdin_str);
    int index = 0;

    token = strtok(stdin_copy, ",");
    while (token != NULL) {
        strcpy(words[index++], token);
        token = strtok(NULL, ",");
    }

    *size = index;
    free(stdin_copy);
}

// Function to convert a string directly
const char* strstrconverter(const char* stdin_str) {
    return stdin_str;
}

int main() {
    // Example usage for lintconverter
    const char* input1 = "1,2,3,4,5";
    int nums[100];
    int size;

    lintconverter(input1, nums, &size);
    for (int i = 0; i < size; i++) {
        printf("%d ", nums[i]);
    }
    printf("\n");

    // Example usage for strintconverter
    const char* input2 = "123";
    int num = strintconverter(input2);
    printf("%d\n", num);

    // Example usage for lstrconverter
    const char* input3 = "apple,banana,orange";
    char words[100][100];
    int word_count;

    lstrconverter(input3, words, &word_count);
    for (int i = 0; i < word_count; i++) {
        printf("%s ", words[i]);
    }
    printf("\n");

    // Example usage for strstrconverter
    const char* input4 = "Hello, World!";
    const char* result_str = strstrconverter(input4);
    printf("%s\n", result_str);

    return 0;
}
