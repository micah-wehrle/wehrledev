package temp.sitemanager.FileSystem;

public class CodeFile {

    public String displayName;
    public String rawFileName;
    public String htmlFileName;
    public int parseVersion;
    public String language;

    public CodeFile(String displayName, String rawFileName, String htmlFileName, int parseVersion, String language) {

        this.displayName = displayName;
        this.rawFileName = rawFileName;
        this.htmlFileName = htmlFileName;
        this.parseVersion = parseVersion;
        this.language = language;
    }
}
