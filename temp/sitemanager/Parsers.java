package temp.sitemanager;

import java.io.File; 
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner; 

public abstract class Parsers {

    public static final String E2_HEADER_PATH = "/e2/e2-code-header.html";
    public static final String LOAD_ERROR_PREFIX = "!!";

    public static final int E2_VER = 1;

    private static final String PAGE_FILENAME = "!!FILENAME";
    private static final String PAGE_BODY = "!!BODY";


    // General function to load a file and return it as a single string
    private static String loadFile(String filePath) {

        String outputFile = "";

        // Verify filePath starts with a '/'
        if(filePath.charAt(0) != '/') {
            filePath = "/" + filePath;
        }

        try {

            // Load file from current directory
            //TODO Create standardized file paths in one location to allow for possible file system restructure
            File file = new File(System.getProperty("user.dir") + "/html/portfolio" + filePath);
            //System.out.println("Attempting to load file from path " + file.getPath());

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
    

    // The following functions are specific parsers for different languages and their private functions
    // Each parser takes a file path, loads the file using loadFile(String),
    //      and then returns the new html file of code

    // Based on the first letter of a new word/number in E2, identifies what group it is in
    private static String e2FirstOfType(String cha) {
        
        if(cha.equals(" ")) {
            return "space";
        }
        else if(cha.equals("@")) {
            return "directive";
        }
        else if("!$%^&*()+=]}[{|:<>,?-".contains(cha)) {
            return "symbol";
        }
        else if(cha.equals("#")) {
            return "comment";
        }
        else if(cha.equals("\"")) {
            return "string";
        }
        else if(Character.isDigit(cha.charAt(0))) {
            return "number";
        }
        else if(Character.isLetter(cha.charAt(0))) { //special variable starters?
            if(cha.toLowerCase().equals(cha)) {
                return "function";
            }
            else {
                return "variable";
            }
        }
        else if(cha.equals("\t")) {
            return "tab";
        }

        
        return "space";
    }

    // Based on the given character in E2, determines if it fits in the current group for syntax color
    private static String e2CharFitsCurType(String cha, String inType) {
        char ch = cha.charAt(0);
        boolean isNum = Character.isDigit(ch);
        boolean isLetter = Character.isLetter(ch);

        switch(inType) {
            case "comment":
                return "true";
            
            case "type":
                if(Character.isLetter(ch)) {
                    return "true";
                }
                break;
            
            case "mlcomment":
                if(cha.equals("]")) {
                    return "check";
                }
                else {
                    return "true";
                }
            
            case "number":
                if(isNum) {
                    return "true";
                }
                break;
            
            case "space":
                if(cha.equals(" ")) {
                    return "true";
                }
                break;
            
            case "variable":
                if(cha.equals(" ")) {
                    return "false";
                }
                else if(cha.equals(":")) {
                    return "pretype";
                }
                else if(isNum || isLetter) {
                    if(cha.equals(" ")) { System.err.println("I guess space is a letter?"); }
                    return "true";
                }
                break;
            
            case "condition":
            case "function":
                if(cha.equals(" ")) {
                    return "false";
                }
                else if(isNum || isLetter) {
                    return "true";
                }
                break;
            
            case "symbol":
                if("!$%^&*()-_]}[{|:<>,?".contains(cha)) {
                    return "true";
                }
                break;
            
            case "string":
                if(cha.equals("\"")) {
                    return "close";
                }
                return "true";
            
        }
        return "false";
    }

    //TODO Known issues with e2Parser:
    /*
     * In nested arrays, the second array type is colored like a variable (blue instead of orange)
     */
    
    // Parse an E2 text file into highlighted html
    public static String e2ParseV1(String filePath, String fileName) { //TODO Add more passed info such as date created and such (what else?)

        String finalhtml = loadFile(E2_HEADER_PATH);

        // Verify the file is not an errored file
        if(finalhtml.substring(0,2) != LOAD_ERROR_PREFIX) {

            // Update details on the html header with info relevant to this E2
            finalhtml = finalhtml.replace(PAGE_FILENAME, fileName);

            String file = loadFile("/e2/raw/" + filePath);
            String html = "<div><span class=\"space\">";
            String inType = "space";
            boolean inArray = false;
            boolean inDir = false;
            double spaceSize = 5;


            // Goals just allows me to print the percent I have finished processing. I have some files that are thousands of lines
            int[] goals = new int[10];

            for(int i = 0; i < 10; i++) {
                goals[i] = (int)Math.floor(file.length()*0.1*(i+1));
            }

            goals[9]-=10;

            int progress = 0;

            System.out.print(fileName + " parsed: ");

            // loop through entire loaded e2 file
            for(int i = 0; i < file.length(); i++) {

                // Just printing the % progress...
                if(progress < 10 && i == goals[progress]) {
                    progress++;
                    System.out.print(progress + "0% .. ");

                    if(progress == 10) {
                        System.out.println();
                    }
                }
                
                

                // thisChar must be a string beause soemtimes I make it longer than a single character
                String thisChar = file.substring(i,i+1);

                // If the current character is \n
                if(thisChar.contains(System.getProperty("line.separator"))) {
                    inDir = false; // ensure you don't miscolor a function as a variable type as in a directive
                    if(!inType.equals("mlcomment") && !inType.equals("quote")) {
                        inType = "space"; // start each new line (unless it's a multi-line section) as a space
                    }
                    
                    html = html + "</span></div><br>\n<div><span class=\"" + inType + "\">"; // close current line, and begin new line of the html
                }
                else { 
                    String charFit = e2CharFitsCurType(thisChar, inType); // check to see how the current character relates to the current colored type you're in. For example, if you're currently in a number, any character except another number indicates that you're not longer in a number.
                    
                    if(charFit.equals("true")) { // if the current char matches the type, add and move on.
                        
                        if(thisChar.equals(" ")) { // however, in the case that this is a space, we will want to count how many spaces and add a span with a margin gap to save on add &nbsp; literally hundreds of times

                            // this section originally just made thisChar = &nbsp; or whatever
                            
                            int spaceCount = 0;
                            while(i < file.length() && file.charAt(i) == ' ') { // figure out how many consecutive spaces
                                spaceCount++;
                                i++;
                            }
                            i--;

                            if(spaceCount > 1) { // only change thisChar from " " if you have more than one. 
                                thisChar = "<span style=\"margin-left:" + spaceSize*spaceCount + "px\"></span>";
                            }
                        }


                        html = html + thisChar;
                    }
                    else if(charFit.equals("close")) { // if it's in a string and you find a quote, close the string.
                        html = html + "\"</span>";
                        inType = "space";
                    }
                    else if(charFit.equals("check")) { // if you see a ] in a mlcomment, see if the comment is over
                        if(file.charAt(i+1) == '#') {
                            html = html + "]#</span>";
                            i++;
                            inType = "space";
                        }
                        else {
                            html = html + "]";
                        }	
                    }
                    else if(charFit.equals("pretype")) {
                        if(inDir) {
                            inType = "type";
                            html = html + "</span><span class=\"symbol\">:</span><span class=\"type\">";
                        }
                        else {
                            inType = "function";
                            html = html + "</span><span class=\"symbol\">:</span><span class=\"function\">";
                        }
                    }
                    else {// we are about to start a new type ...
                    
                        inType = e2FirstOfType(thisChar);
                        
                        if(inType.equals("comment")) {
                            if(file.charAt(i+1) == '[') { // it's a mlcomment
                                inType = "ml" + inType;
                            }
                        }
                        else if(inType.equals("function")) {
                            String restOfWord = "";
                            
                            int j = i;
                            
                            while(j < file.length()) {
                                char thatChar = file.charAt(j);
                                if(!Character.isLetter(thatChar)) {
                                    break;
                                }
                                restOfWord = restOfWord + thatChar;
                                
                                j++;
                            }

                            String[] possibleFuncs = "if elseif for else while function case break continue switch local return default".split(" ");
                            
                            for(int k = 0; k < possibleFuncs.length; k++) {
                                if(possibleFuncs[k].equals(restOfWord)) {
                                    inType = "condition";
                                    break;
                                }
                            }

                            if(inArray) {
                                inType = "type";
                            }
                        }
                        else if(inType.equals("tab")) {
                            inType = "space";
                            thisChar = "&emsp;&emsp;";
                        }
                        else if(inType.equals("symbol")) {
                            if(thisChar.equals("[")) {
                                inArray = true;
                            }
                            else if(inArray && thisChar.equals("]")) {
                                inArray = false;
                            }
                        }
                            
                            
                        
                        html = html + "</span><span class=\"" + inType + "\">" + thisChar;

                        if(inType.equals("directive")) { 
                            inDir = true;
                            String restOfWord = "";
                            
                            int j = i;
                            
                            while(j < file.length()) {
                                char thatChar = file.charAt(j);
                                if(thatChar == ' ') {
                                    break;
                                }
                                restOfWord = restOfWord + thatChar;
                                
                                j++;
                            }
                            
                            i++;
                            
                            while(i < file.length()) {
                                char thatChar = file.charAt(i);
                                if(restOfWord.equals("@name") || restOfWord.equals("@model")) {
                                    if(thatChar == '\n') {
                                        i--;
                                        break;
                                    }
                                }
                                else {
                                    if(thatChar == ' ') {
                                        i--;
                                        break;
                                    }
                                }
                                
                                html = html + thatChar;
                                i++;
                            }
                        }
                    }
                }
            }

            html = html + "</span></div>";

            // The html has been generated and capped, now go through and indent each line instead of having a billion spaces

            // eventually...

            /* 
            String[] lines = html.split(System.lineSeparator());
            html = "";

            for(int i = 0; i < lines.length; i++) {
                String line = lines[i];

                for(int j = 0; j < line.length(); j++) {
                    if(line.charAt(0) == '&' && j < line.length()-4) {



                    }
                }
            }
            //*/

            //html = html.replace("&nbsp;&nbsp;&nbsp;&nbsp;","");

            //html = html.replace("&nbsp;&nbsp;&nbsp;&nbsp;", "&emsp;&emsp;");
            
            // Insert generated html of highlighted syntax into the loaded header
            finalhtml = finalhtml.replace(PAGE_BODY, html);
        }

        return finalhtml;
    }
        
    
}
