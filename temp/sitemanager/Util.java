package temp.sitemanager;

public abstract class Util {
    
    public static boolean stringArrayContains(String[] array, String str) {

        for(String a : array) {
            
            if(a.equals(str)) {
                return true;
            }
        }
        return false;
    }
}
