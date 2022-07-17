package temp.sitemanager;

import java.nio.file.Files;
import java.nio.file.Paths;

import temp.sitemanager.Window.MyWindow;



public class SiteManager {

    
    
    public static void main(String[] args) {

        //new MyWindow();

        String fileName = "TestParsedFile.html";

        Parsers.writeFile("/html/portfolio/e2/" + fileName, Parsers.e2ParseV1("TestE2.txt", "Test file"));
        
        //Parsers.writeFile("/html/portfolio/e2/" + "MayOSParsed.html", Parsers.e2ParseV1("MayOS v2.txt", "Test file"));







    }



}

