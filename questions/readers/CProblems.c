// Function declarations
int* lintconverter(const char* stdin, int* size);
char** lstrconverter(const char* stdin, int* size);
int intconverter(const char* stdin);
char* strconverter(const char* stdin);

int* lintconverter(const char* stdin, int* size) {
    int* result = NULL;
    char* input_copy = strdup(stdin); // Duplicate the input to avoid modifying the original
    char* token = strtok(input_copy, ",");
    int count = 0;

    // First pass to count the number of integers
    while (token) {
        count++;
        token = strtok(NULL, ",");
    }

    // Allocate memory for the result
    result = (int*)malloc(count * sizeof(int));
    if (result == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(EXIT_FAILURE);
    }

    // Second pass to actually store the integers
    token = strtok(stdin, ",");
    for (int i = 0; i < count; i++) {
        result[i] = atoi(token);
        token = strtok(NULL, ",");
    }

    free(input_copy);
    *size = count;
    return result;
}

char** lstrconverter(const char* stdin, int* size) {
    char** result = NULL;
    char* input_copy = strdup(stdin);
    char* token = strtok(input_copy, ",");
    int count = 0;

    // First pass to count the number of strings
    while (token) {
        count++;
        token = strtok(NULL, ",");
    }

    // Allocate memory for the result
    result = (char**)malloc(count * sizeof(char*));
    if (result == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(EXIT_FAILURE);
    }

    // Second pass to actually store the strings
    token = strtok(stdin, ",");
    for (int i = 0; i < count; i++) {
        result[i] = strdup(token);
        token = strtok(NULL, ",");
    }

    free(input_copy);
    *size = count;
    return result;
}

int intconverter(const char* stdin) {
    return atoi(stdin);
}

char* strconverter(const char* stdin) {
    return strdup(stdin);
}