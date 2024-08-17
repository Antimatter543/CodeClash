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
int intconverter(const char* stdin_str) {
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
const char* strconverter(const char* stdin_str) {
    return stdin_str;
}