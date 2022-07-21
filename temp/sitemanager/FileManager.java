package temp.sitemanager;

import java.io.File; 
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner; 

import org.json.*;

public class FileManager {

    public static final String E2_HEADER_PATH = "/e2/e2-code-header.html";
    public static final String PORTFOLIO_PATH = "/html/portfolio";
    public static final String LOAD_ERROR_PREFIX = "!!";

    private String rootFilePath;
    private String rootFileRaw;

    private JSONObject json;

    public FileManager(String rootFilePath) {

        this.rootFilePath = rootFilePath;
        this.rootFileRaw = loadFile(rootFilePath);

        json = new JSONObject(rootFileRaw);

    }

    // General function to load a file and return it as a single string
    public static String loadFile(String filePath) {

        String outputFile = "";

        // Verify filePath starts with a '/'
        if(filePath.charAt(0) != '/') {
            filePath = "/" + filePath;
        }

        try {

            // Load file from current directory
            //TODO Create standardized file paths in one location to allow for possible file system restructure
            File file = new File(System.getProperty("user.dir") + filePath);

            Scanner reader = new Scanner(file);
            while (reader.hasNextLine()) { 
                // Compile file into a single string
                outputFile = outputFile + reader.nextLine() + "\n";
            }
            reader.close();

        } 
        catch (FileNotFoundException e) {

            // Print issue if file isn't found, and add specific prefix to output string 
            System.err.println("Unable to load file: " + filePath);
            outputFile = LOAD_ERROR_PREFIX + " ERROR LOADING FILE FROM INPUT:\n" + filePath;
            e.printStackTrace();
        }
        
        return outputFile;
            
    }

    // Write files into the current file system
    public static void writeFile(String filePathAndName, String contents) {

        // Makes sure path begins with a /
        if(filePathAndName.charAt(0) != '/') {
            filePathAndName = "/" + filePathAndName;
        }

        // Sets up to find included 
        String[] namePieces = filePathAndName.split("\\.");
        String[] acceptableEndings = {"txt", "html"};

        if(namePieces.length == 1) {
            filePathAndName = filePathAndName + ".txt";
            System.out.println("here");
        } 
        else if(!Util.stringArrayContains(acceptableEndings, namePieces[namePieces.length-1])) {
            System.out.println("Unacceptable file type: ." +namePieces[namePieces.length-1]);
            filePathAndName = filePathAndName.substring(0, filePathAndName.length() - namePieces[namePieces.length-1].length()) + "txt";
            System.out.println("Updated file path to: " + filePathAndName);
        }

        

        try {
            Files.write(Paths.get(System.getProperty("user.dir") + filePathAndName), contents.getBytes());
        }
        catch(Exception e) {
            System.err.println("Error writing file: " + filePathAndName);
            e.printStackTrace();
        }

        
    }
    
}
