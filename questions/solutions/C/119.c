int* getRow(int rowIndex, int* returnSize) {
    *returnSize = rowIndex + 1;
    int *triangle = malloc(*returnSize * sizeof(int));

    for (int i = 0; i < *returnSize; i++) {
        int last = 1;
        for (int ii = 1; ii < i; ii++) {
            int tmp = triangle[ii];
            triangle[ii] += last;
            last = tmp;
        }
        triangle[i] = 1;
    }

    return triangle;
}
