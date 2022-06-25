package temp.sitemanager;

import java.io.File; 
import java.io.FileNotFoundException;  
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
            System.out.println("Attempting to load file from path " + file.getPath());

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
    

    // The following functions are specific parsers for different languages and their private functions
    // Each parser takes a file path, loads the file using loadFile(String),
    //      and then returns the new html file of code

    // Based on the first letter of a new word/number in E2, identifies what group it is in
    private static String e2FirstOfType(String cha) {
        
        if(cha == " ") {
            return "space";
        }
        else if(cha == " ") {
            return "directive";
        }
        else if("!$%^&*()+=]}[{|:<>,?-".contains(cha)) {
            return "symbol";
        }
        else if(cha == "#") {
            return "comment";
        }
        else if(cha == "\"") {
            return "string";
        }
        else if(Character.isDigit(cha.charAt(0))) {
            return "number";
        }
        else if(Character.isLetter(cha.charAt(0))) { //special variable starters?
            if(cha.toLowerCase() == cha) {
                return "function";
            }
            else {
                return "variable";
            }
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
                if(cha == "]") {
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
                if(cha == " ") {
                    return "true";
                }
                break;
            
            case "variable":
                if(cha == " ") {
                    return "false";
                }
                else if(cha == ":") {
                    return "pretype";
                }
                else if(isNum || isLetter) {
                    if(cha == " ") { System.err.println("I guess space is a letter?"); }
                    return "true";
                }
                break;
            
            case "condition":
            case "function":
                if(cha == " ") {
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
                if(cha == "\"") {
                    return "close";
                }
                return "true";
            
        }
        return "false";
    }

    
    // Parse an E2 text file into highlighted html
    public static String e2Parse(String filePath, String fileName) { //TODO Add more passed info such as date created and such (what else?)

        String finalhtml = loadFile(E2_HEADER_PATH);

        // Verify the file is not an errored file
        if(finalhtml.substring(0,2) != LOAD_ERROR_PREFIX) {

            // Update details on the html header with info relevant to this E2
            finalhtml = finalhtml.replace(PAGE_FILENAME, fileName);

            String file = loadFile("/e2/raw/" + filePath);
            String html = "<div>";
            String inType = "space";

            // loop through entire loaded e2 file
            for(int i = 0; i < file.length(); i++) {
                String thisChar = file.substring(i,i+1);


                if(thisChar == "\n") {
                    if(inType != "mlcomment" && inType != "quote") {
                        inType = "space";
                    }
                    i++;
                    html = html + "</span></div>\n<div><span class=\"" + inType + "\">";
                }
                else { 
                    String charFit = e2CharFitsCurType(thisChar, inType);
                    
                    if(charFit == "true") { // if the current char matches the type, add and move on.
                        
                        if(thisChar == " ") {
                            thisChar = "&nbsp;";
                        }
                        html = html + thisChar;
                    }
                    else if(charFit == "close") { // if it's in a string and you find a quote, close the string.
                        html = html + "\"</span>";
                        inType = "space";
                    }
                    else if(charFit == "check") { // if you see a ] in a mlcomment, see if the comment is over
                        if(file.charAt(i+1) == '#') {
                            html = html + "]#</span>";
                            i++;
                            inType = "space";
                        }
                        else {
                            html = html + "]";
                        }	
                    }
                    else if(charFit == "pretype") {
                        inType = "type";
                        html = html + "</span><span class=\"symbol\">:</span><span class=\"type\">";
                    }
                    else {// we are about to start a new type ...
                    
                        inType = e2FirstOfType(thisChar);
                        
                        if(inType == "comment") {
                            if(file.charAt(i+1) == '[') { // it's a mlcomment
                                inType = "ml" + inType;
                            }
                        }
                        else if(inType == "function") {
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
                                if(possibleFuncs[k] == restOfWord) {
                                    inType = "condition";
                                    break;
                                }
                            }
                        }
                            
                            
                        
                        html = html + "</span><span class=\"" + inType + "\">" + thisChar;

                        if(inType == "directive") { 
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
                                if(restOfWord == "@name" || restOfWord == "@model") {
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


            //System.out.println(file);
            //System.out.println("\n\n\n\n\nAfter:\n\n\n\n\n");
            //System.out.println(html);

            
            // Insert generated html of highlighted syntax into the loaded header
            finalhtml = finalhtml.replace(PAGE_BODY, html);
        }

        return finalhtml;
    }
    
}
