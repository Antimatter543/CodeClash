import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class Solution {
    private Map<Integer, List<Integer>> memo = new HashMap<>();

    public List<Integer> getRow(int rowIndex) {
        if (memo.containsKey(rowIndex)) {
            return memo.get(rowIndex);
        }
        if (rowIndex == 0) {
            List<Integer> row = new ArrayList<>();
            row.add(1);
            memo.put(rowIndex, row);
            return row;
        }
        List<Integer> previousRow = getRow(rowIndex - 1);
        List<Integer> result = new ArrayList<>();
        result.add(1);
        for (int i = 0; i < previousRow.size() - 1; i++) {
            result.add(previousRow.get(i) + previousRow.get(i + 1));
        }
        result.add(1);
        memo.put(rowIndex, result);
        return result;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        int rowIndex = 5;  // Change this index to test different rows
        List<Integer> row = solution.getRow(rowIndex);

        // Print the row
        System.out.println("Row " + rowIndex + ": " + row);
    }
}
