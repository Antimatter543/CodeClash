import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JavaProblems {

    public static List<Integer> lintconverter(String stdin) {
        List<Integer> nums = new ArrayList<>();
        for (String numStr : stdin.split(",")) {
            nums.add(Integer.parseInt(numStr.trim()));
        }
        return nums;
    }

    public static List<String> lstrconverter(String stdin) {
        List<String> words = new ArrayList<>();
        words.addAll(Arrays.asList(stdin.split(",")));
        return words;
    }

    public static int intconverter(String stdin) {
        return Integer.parseInt(stdin.trim());
    }

    public static String strconverter(String stdin) {
        return stdin.trim();
    }
}
