import java.util.ArrayList;
import java.util.List;

class JavaProblems {

    // Convert comma-separated string to int[]
    public static int[] lintconverter(String stdin) {
        List<Integer> nums = new ArrayList<>();
        for (String numStr : stdin.split(",")) {
            nums.add(Integer.parseInt(numStr.trim()));
        }
        // Convert List<Integer> to int[]
        return nums.stream().mapToInt(Integer::intValue).toArray();
    }

    // Convert comma-separated string to String[]
    public static String[] lstrconverter(String stdin) {
        // Convert List<String> to String[]
        return stdin.split(",");
    }

    // Convert string to int
    public static int intconverter(String stdin) {
        return Integer.parseInt(stdin.trim());
    }

    // Convert string to String
    public static String strconverter(String stdin) {
        return stdin.trim();
    }
}
