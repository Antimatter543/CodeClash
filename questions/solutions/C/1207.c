int compare(const void *a, const void *b) {
    return (*(int *)a - *(int *)b);
}

bool uniqueOccurrences(int* arr, int arrSize) {
    const int offset = 1000;
    int count[2001] = {0};  
    for (int i = 0; i < arrSize; i++) {
        count[arr[i] + offset]++;
    }

    qsort(count, 2001, sizeof(int), compare);

    for (int i = 0; i < 2001 - 1; i++) {
        if (count[i] > 0) {
            if (count[i] == count[i+1]) {
                return false;
            }
        }
    }

    return true;
}