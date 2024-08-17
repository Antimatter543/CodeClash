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
             ("Java", "lintconverter"): "JavaProblems.lintconverter",("Java", "liststr"): "JavaProblems.lstrconverter",
             ("Java", "int"): "JavaProblems.intconverter",("Java", "str"): "JavaProblems.strconverter",
             ("C", "lintconverter"): "CProblems.lintconverter",("C", "liststr"): "CProblems.lstrconverter",
             ("C", "int"): "CProblems.intconverter",("C", "str"): "CProblems.strconverter",}

# dictthing = {("Python", "listint"): "Problems.lintconverter", ("Python, liststr"): "Problems.lstrconverter",
#              ("Python", "int"): "Problems.intconverter", ("Python, str"): "Problems.strconverter",
#              ("Java", "strconverter"): "JavaProblems.strconverter"}

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
if c and int:
 judge = """
    #include <stdio.h>   // For printf, fopen, fclose, fgets, etc.
    #include <stdlib.h>  // For malloc, free, exit, etc.
    #include <string.h>  // For strlen, strcpy, etc. (not strictly needed in your current snippet but often used with string operations)

    // add {c string}

    char* read_file_as_string(const char* filename) {
        FILE* file = fopen(filename, "r");  // Open the file for reading
        if (file == NULL) {
            perror("Failed to open file");
            return NULL;
        }

        // Seek to the end of the file to get its size
        fseek(file, 0, SEEK_END);
        long file_size = ftell(file);
        rewind(file);  // Go back to the beginning of the file

        // Allocate memory to store the contents of the file (+1 for the null terminator)
        char* buffer = (char*)malloc((file_size + 1) * sizeof(char));
        if (buffer == NULL) {
            perror("Failed to allocate memory");
            fclose(file);
            return NULL;
        }

        // Read the file into the buffer
        size_t read_size = fread(buffer, sizeof(char), file_size, file);
        if (read_size != file_size) {
            perror("Failed to read the entire file");
            free(buffer);
            fclose(file);
            return NULL;
        }

        buffer[file_size] = '\0';  // Null-terminate the string

        fclose(file);  // Close the file
        return buffer; // Return the buffer
    }


    const char* filename = "questions/readers/c_reader.c";  // Name of the file to read
    char* file_contents = read_file_as_string(filename);

    if (file_contents != NULL) {
        printf("File Contents:\n%s\n", file_contents);
        free(file_contents);  // Free the allocated memory
    }

    int parsed_input = {dictthing[("C", intconverter]}
    int* output = getRow(parsed_input)
    for (int i = 0; i < size; i++) {
        printf("%d ", output[i]);  // Print each element
    }
    printf("\n");
    """
elif C and char*:
 judge = """
    #include <stdio.h>   // For printf, fopen, fclose, fgets, etc.
    #include <stdlib.h>  // For malloc, free, exit, etc.
    #include <string.h>  // For strlen, strcpy, etc. (not strictly needed in your current snippet but often used with string operations)

    // add {c string}

    char* read_file_as_string(const char* filename) {
        FILE* file = fopen(filename, "r");  // Open the file for reading
        if (file == NULL) {
            perror("Failed to open file");
            return NULL;
        }

        // Seek to the end of the file to get its size
        fseek(file, 0, SEEK_END);
        long file_size = ftell(file);
        rewind(file);  // Go back to the beginning of the file

        // Allocate memory to store the contents of the file (+1 for the null terminator)
        char* buffer = (char*)malloc((file_size + 1) * sizeof(char));
        if (buffer == NULL) {
            perror("Failed to allocate memory");
            fclose(file);
            return NULL;
        }

        // Read the file into the buffer
        size_t read_size = fread(buffer, sizeof(char), file_size, file);
        if (read_size != file_size) {
            perror("Failed to read the entire file");
            free(buffer);
            fclose(file);
            return NULL;
        }

        buffer[file_size] = '\0';  // Null-terminate the string

        fclose(file);  // Close the file
        return buffer; // Return the buffer
    }


    const char* filename = "questions/readers/c_reader.c";  // Name of the file to read
    char* file_contents = read_file_as_string(filename);

    if (file_contents != NULL) {
        printf("File Contents:\n%s\n", file_contents);
        free(file_contents);  // Free the allocated memory
    }

    char* parsed_input = {dictthing[("C", strconverter]}
    char* output = reverseWords(parsed_input)
    printf("%s\n", output);
    """
elif C and char**:
 judge = """
    #include <stdio.h>   // For printf, fopen, fclose, fgets, etc.
    #include <stdlib.h>  // For malloc, free, exit, etc.
    #include <string.h>  // For strlen, strcpy, etc. (not strictly needed in your current snippet but often used with string operations)

    // add {c string}

    char* read_file_as_string(const char* filename) {
        FILE* file = fopen(filename, "r");  // Open the file for reading
        if (file == NULL) {
            perror("Failed to open file");
            return NULL;
        }

        // Seek to the end of the file to get its size
        fseek(file, 0, SEEK_END);
        long file_size = ftell(file);
        rewind(file);  // Go back to the beginning of the file

        // Allocate memory to store the contents of the file (+1 for the null terminator)
        char* buffer = (char*)malloc((file_size + 1) * sizeof(char));
        if (buffer == NULL) {
            perror("Failed to allocate memory");
            fclose(file);
            return NULL;
        }

        // Read the file into the buffer
        size_t read_size = fread(buffer, sizeof(char), file_size, file);
        if (read_size != file_size) {
            perror("Failed to read the entire file");
            free(buffer);
            fclose(file);
            return NULL;
        }

        buffer[file_size] = '\0';  // Null-terminate the string

        fclose(file);  // Close the file
        return buffer; // Return the buffer
    }


    const char* filename = "questions/readers/c_reader.c";  // Name of the file to read
    char* file_contents = read_file_as_string(filename);

    if (file_contents != NULL) {
        printf("File Contents:\n%s\n", file_contents);
        free(file_contents);  // Free the allocated memory
    }

    char** parsed_input = {dictthing[("C", lstrconverter]}
    int output = longStrChain(parsed_input)
    printf("%i\n", output);
    """
elif C and int*:
 judge = """
    #include <stdio.h>   // For printf, fopen, fclose, fgets, etc.
    #include <stdlib.h>  // For malloc, free, exit, etc.
    #include <string.h>  // For strlen, strcpy, etc. (not strictly needed in your current snippet but often used with string operations)

    // add {c string}

    char* read_file_as_string(const char* filename) {
        FILE* file = fopen(filename, "r");  // Open the file for reading
        if (file == NULL) {
            perror("Failed to open file");
            return NULL;
        }

        // Seek to the end of the file to get its size
        fseek(file, 0, SEEK_END);
        long file_size = ftell(file);
        rewind(file);  // Go back to the beginning of the file

        // Allocate memory to store the contents of the file (+1 for the null terminator)
        char* buffer = (char*)malloc((file_size + 1) * sizeof(char));
        if (buffer == NULL) {
            perror("Failed to allocate memory");
            fclose(file);
            return NULL;
        }

        // Read the file into the buffer
        size_t read_size = fread(buffer, sizeof(char), file_size, file);
        if (read_size != file_size) {
            perror("Failed to read the entire file");
            free(buffer);
            fclose(file);
            return NULL;
        }

        buffer[file_size] = '\0';  // Null-terminate the string

        fclose(file);  // Close the file
        return buffer; // Return the buffer
    }


    const char* filename = "questions/readers/c_reader.c";  // Name of the file to read
    char* file_contents = read_file_as_string(filename);

    if (file_contents != NULL) {
        printf("File Contents:\n%s\n", file_contents);
        free(file_contents);  // Free the allocated memory
    }
    
    int* parsed_input = {dictthing[("C", lintconverter]}
    int output = findDuplicate(parsed_input)
    printf("%i\n", output);
    """

dict["language", "listint"] = 

func = dict["language", "listint"] 

parsed_input = func(stdin)
sol = Solution()
print(sol.getRow(parsed_input))
"
// send to judge and get output string

// compare judge output to answers.txt output