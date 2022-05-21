/**
*
*	Expression 2 Syntax Highlighter (attempt 1)
*
*	This js script will take Expression 2 code and convert it to html with
*	the appropriate syntax highlighting based on the coloring in the E2 IDE.
*
*	This was my first attempt, and parses the code in a single pass.
*	I'll be creating a version 2 that has better and simpler logic by making
*	two passes to parse the code.
*
*	Made by Micah Wehrle in May 2022 for wehrle.dev
*
**/



var path = window.location.pathname;
var page = path.split('/').pop().replace('.html','');

var txtFull = `@name MayOS v2
@inputs EGP:wirelink KeysIn:wirelink KeyHit KeysInUse User:entity
@outputs Kick
@persist Data:table Scr:entity Keyboard:entity TypeData:string TypePos Scroll Text:table MP Update:table HeldKey KeyToCheck:string
@persist Disp:table [Version Password GuestPW]:string HorizScroll LastUser:entity LastWep:string Log:array Game:table UID
@model 

if(first()) {
        
    Password = "poopy"
    GuestPW = "guest"

    
    MP = 10 # MAX PERF
    
    Version = "2.052" # Messing with this may cause the E2 to want to update.
        
    Update = table()
        Update["URL",string] = "https://pastebin.com/raw/9nqwQ74S"
        Update["NewURL",string] = "null"
        #Update["Updated",string] = "2020/12/31" # use yyyy/mm/dd
        Update["Creator",string] = "ElMico"
    
    UID = random()
    
    #[

    ###########   Changelog:   ###############
    
    v2.052
    Feb 06, 19
        Added "!summon" command
        Added locations, items, containers, and pathways to Zork!
    
    v2.051
    Feb 05, 19
        Made 2048 spawn 4s occasionally
            (And I got a new high score)
        Began work on Minesweeper2 (will have larger board sizes)
        Began work on Zork
        
    
    v2.05
    Feb 01, 19
        Improved code ordering
        Tic-Tac-Toe fixes and improvements
    
    v2.04
    Jan 31, 19
        Added 2048
        Added multiplayer Tic-Tac-Toe
    
    v2.03
    Jan 30, 19
        Improved keyboard input
        Added Score and Next for Tetris
        Added remote command ability using "!cmd <command>" in chat
        Fixed error when updating caused by untrimmed URL request
    
    v2.02 
    Jan 29, 19
        Introduced autocomplete
        
    v2.01 
    Jan 28, 19
        Auto updating
        Added Tetris highlight
        First Minesweeper click never a mine.
    
    
    
    
    ###########   Known Bugs:   #############
    
    Tetris: sometimes you can spin into blocks and into the ground.
    
    ###########   Coming soon:   ############
    
    Minesweeper 2
        Difficulties:
                H:  W:  M:
        1:      9   9   10
        2:      16  16  40
        3:      16  30  99
        
    ###########   High scores:  #############
    
    2048:
        ElMico: 5032
    ]#


    #### Functions ##############################################################
    
    function void resetGame() {} #prototype
    
    function number soundI() {
        Data["SoundI",number] = Data["SoundI",number] + 1
        return  Data["SoundI",number]%10+ Data["MinSoundI",number]
    }
    
    function void playSound(Path:string, Len) {
        local N = soundI()
        holoEntity(N):soundPlay(N,0,Path)
        timer("StopSound "+N,Len)
    }
    
    function string shortDate() {
        local D = date()
        return ""+D["month",number]+"/"+D["day",number]+"/"+D["year",number]+" "+D["hour",number]+":"+D["min",number]+":"+D["sec",number]
    }
    
    function string dateOnly() {
        local D = date()
        return ""+D["year",number]+ (D["month",number] < 10 ? "/0" : "/") +D["month",number]+(D["day",number] < 10 ? "/0" : "/")+D["day",number]
    }
    
    function number daysSince(Str:string) { # does not account for leap years
        local Date = table(Str:explode("/"))
        Date:pushArray(dateOnly():explode("/"))
        
        local Days = array(0,0)
        local Mult = table(365,array(31,28,31,30,31,30,31,  31,30,31,30,31),1)
        
        for(I = 1, 3) {
            for(J = 1, 2) {
                if(I == 2) {
                    for(K = 1, Date[J,array][I,string]:toNumber()-1) {
                        Days[J,number] = Days[J,number] + Mult[2,array][K,number]
                    }
                }
                else {
                    Days[J,number] = Days[J,number] + Mult[I,number]*Date[J,array][I,string]:toNumber()
                }
            }
        }
        
        return Days[2,number]-Days[1,number]
    }
    
    function void logData(Type:string, Data:string) {
        
        Log:pushString(shortDate() +"&&"+ Type +"&&"+ LastUser:name() +"&&"+ Data)
    }
    
    function void egpCreateGroup(Name:string, LoEI, HiEI) {
        Data["EGP Group Names",table]:pushString(Name)
        Data["EGP Groups",table][Name,array] = array(LoEI, HiEI)
    }
    
    function void egpAlph(EI, Alph) {
        EGP:egpAlpha(EI, Alph)
        Data["EGP Alphas",array][EI,number] = Alph+1
    }
    
    function void resetEGP() {
        
        local EI = 1
        EGP:egpClear()
        
        ### The lowest thing shown in EGP
        EGP:egpBox(EI,vec2(256), vec2(512)) #backdrop I guess
            EGP:egpColor(EI,vec())
        egpCreateGroup("Backdrop",EI, EI)
        EI++
        
        # command prompt
        Data["EGP CmdP Bars",number] = EI
        Data["EGP CmdP Bars Col",vector] = vec(15)
        for(I = 0, 18) {
            EGP:egpBox(EI+I, vec2(256, 54 + 23*I), vec2(512, 23))
                EGP:egpColor(EI+I, Data["EGP CmdP Bars Col",vector]*(I%2))
        }
        
        Data["EGP Text I",number] = EI+19
        for(I = 0, 18) {
            EGP:egpText(EI+I+19, "", vec2(4, 43+23*I))
            EGP:egpFont(EI+I+19, "Courier New", 21)
        }
        EGP:egpBox(EI+38, vec2(256, 512-15), vec2(512, 30))
            EGP:egpColor(EI+38, vec(60))
        EGP:egpText(EI+39, ">", vec2(4, 485))
            EGP:egpFont(EI+39, "Courier New", 25)
        Data["EGP Type I",number] = EI+40
        EGP:egpText(EI+40, "", vec2(17, 485))
            EGP:egpFont(EI+40, "Courier New", 25)
        EGP:egpBox(EI+41, vec2(21, 496), vec2(3, 22))
        Data["EGP Cursor Root",vector2] = vec2(21, 496)
        Data["EGP Cursor",number] = EI+41
        egpCreateGroup("Command Line", EI, EI+41)
        EI += 42
        # end command prompt
        
        
        # login screen'
        EGP:egpBox(EI,vec2(256), vec2(512))
            EGP:egpColor(EI,vec())
        EGP:egpBox(EI+1,vec2(256,256*1.5),vec2(512*1.5))
            EGP:egpColor(EI+1,vec(0,128,0))
            EGP:egpMaterial(EI+1,"gui/gradient_down")
        EGP:egpBox(EI+2, vec2(256), vec2(300,220))
            EGP:egpColor(EI+2, vec(190))
        EGP:egpBoxOutline(EI+3, vec2(256), vec2(300,220))
            EGP:egpSize(EI+3,4)
            EGP:egpColor(EI+3,vec(30))
        EGP:egpText(EI+4, "MayOS v"+Version, vec2(256-120, 256-105))
            EGP:egpColor(EI+4, vec(40))
            EGP:egpFont(EI+4, "Courier New", 30)
        EGP:egpLine(EI+5, vec2(256-130, 256-74),vec2(256+130, 256-74))
            EGP:egpColor(EI+5, vec(100))
            EGP:egpSize(EI+5, 2)
        EGP:egpText(EI+6, "Please enter password:", vec2(256-110,256-30))
        EGP:egpBox(EI+7, vec2(256,280), vec2(230, 40))
        EGP:egpBoxOutline(EI+8, EGP:egpPos(EI+7), EGP:egpSize(EI+7))
            EGP:egpSize(EI+8,2)
            EGP:egpColor(EI+8,vec(50))
        
        Data["EGP Password I", number] = EI+9
        Data["EGP Password Chars",number] = 11
        for(I = 0, 10) {
            EGP:egpCircle(EI+9+I, vec2(256-100 + I*20, 280), vec2(8))
            EGP:egpColor(EI+9+I,vec())
        }
        
        egpCreateGroup("Login",EI, EI+19)
        EI+=20
        # end login screen
        
        
        # Application data
        egpCreateGroup("Game Data", EI, EI+799)
        EI+=800
        # end Application data
        
        
        ### Last things drawn
        
        EGP:egpBox(EI, vec2(256,20), vec2(512, 40))
            EGP:egpColor(EI, vec(50))
        EGP:egpBox(EI+1,vec2(256,-40), vec2(512, 160))
            EGP:egpColor(EI+1, vec(255))
            EGP:egpMaterial(EI+1, "gui/gradient_down")
        EGP:egpText(EI+2,"MayOS",vec2(5))
            EGP:egpColor(EI+2,vec())
            EGP:egpFont(EI+2,"Courier New", 35)
        Data["EGP Version I",number] = EI+3
        EGP:egpText(EI+3,"v"+Version,vec2(507,5))
            EGP:egpColor(EI+3,vec())
            EGP:egpFont(EI+3,"Courier New", 35)
            EGP:egpAlign(EI+3,2)
        
        Data["EGP Mayo", number] = EI+4
        EGP:egpRoundedBox(EI+4, vec2(120,21), vec2(18,23))
            EGP:egpRadius(EI+4,3)
        EGP:egpBox(EI+5, vec2(), vec2(18,10)) 
            EGP:egpColor(EI+5, vec(200,200,255))
            EGP:egpParent(EI+5,EI+4)
        EGP:egpBox(EI+6, vec2(0,-13), vec2(18,4)) 
            EGP:egpColor(EI+6,vec(0,0,200))
            EGP:egpParent(EI+6,EI+4)
        
        EGP:egpLine(EI+7, vec2(0,39), vec2(512,39))
            EGP:egpColor(EI+7,vec(30))
            EGP:egpSize(EI+7,2)
        egpCreateGroup("Header", EI, EI+7)
        EI+=8
        
        hint("Expected " + EI + " objects.",3)
    }
    
    function void addText(Str:string, Col:vector, LapSpace) {
        Scroll = 0
        if(Str:length() > 45) {
            
            local NewAr = array()
            #[ Way 1
            NewAr:pushString( Str:sub(1, 45) )
            
            local GetI = 46
            for(I = 2, ceil(Str:length()/(45-LapSpace))) {
                NewAr:pushString(" ":repeat(LapSpace) + Str:sub( GetI, GetI+44-LapSpace) )
                GetI+=(45-LapSpace)
            }
            #]# 
            
            local StrEx = Str:explode(" ")
            local Len = StrEx:count()
            local ThisSet = StrEx:removeString(1)
            local AddOn = 0
            
            if(StrEx:count() == 0) {
                while(ThisSet:length() > 45-AddOn) {
                    NewAr:pushString(" ":repeat(AddOn)+ThisSet:sub(1,45-AddOn))
                    ThisSet = ThisSet:sub(46-AddOn)
                    AddOn = LapSpace
                }
                NewAr:pushString(" ":repeat(AddOn)+ThisSet)
            }
            else {
                for(I = 1, StrEx:count()) {
                    
                    while(ThisSet:length() > 45-AddOn) {
                        NewAr:pushString(" ":repeat(AddOn)+ThisSet:sub(1,45-AddOn))
                        ThisSet = ThisSet:sub(46-AddOn)
                        AddOn = LapSpace
                    }
                    
                    if( (ThisSet + " " + StrEx[I,string]):length() > 45-AddOn) {
                        if(StrEx[I,string]:length() > 45-AddOn) {
                            local ThisSetLen = ThisSet:length()
                            ThisSet = ThisSet + " " + StrEx[I,string]:sub(1, 45-AddOn - (ThisSet:length()+1))
                            StrEx[I,string] = StrEx[I,string]:sub(46-AddOn - (ThisSetLen+1))
                        }
                        NewAr:pushString(" ":repeat(AddOn)+ThisSet)
                        ThisSet = StrEx[I,string]
                        AddOn = LapSpace
                        
                        if(I == StrEx:count()) {
                            while(ThisSet:length() > 45-AddOn) {
                                NewAr:pushString(" ":repeat(AddOn)+ThisSet:sub(1,45-AddOn))
                                ThisSet = ThisSet:sub(46-AddOn)
                            }
                            NewAr:pushString(" ":repeat(AddOn)+ThisSet)
                        }
                        
                    }
                    else {
                        ThisSet = ThisSet + " " + StrEx[I,string]
                        
                        if(I == StrEx:count()) {
                            NewAr:pushString(" ":repeat(AddOn)+ThisSet)
                        }
                    }
                }
            }
            
            
            for(I = 1, NewAr:count()) {
                Text["Text",table]:insertArray(1, array(NewAr[I,string], Col))
            }
        }
        else {
            Text["Text",table]:insertArray(1,array(Str,Col))
        }
    }
    
    function void addText(Str:string, Col:vector) {
        addText(Str, Col, 0)
    }
    
    function void addText(Str:string) {
        addText(Str, vec(255), 0)
    }
    
    function void updateConsole() {
        
        for(I = 1, 19) {
            EGP:egpColor(I+Data["EGP CmdP Bars",number]-1, Data["EGP CmdP Bars Col",vector]* ( (I-1+ (Scroll%2))%2))
            
            local Txt = Text["Text",table][I+Scroll,array][1,string]
            EGP:egpSetText(Data["EGP Text I",number]+19-I, Txt)
            EGP:egpColor(Data["EGP Text I",number]+19-I, Text["Text",table][I+Scroll,array][2,vector])
        }
        
        if(Scroll > 0) {
            EGP:egpColor(Data["EGP Text I",number]+18, vec(255))
                EGP:egpSetText(Data["EGP Text I",number]+18,"...")
        }
    }
    
    function string getLog(N) {
        local L = Log[N,string]:explode("&&")
        
        switch(L[2,string]) {
            case "cmd",
                return L[1,string] + " - " + L[3,string] + " entered command: " + L[4,string]
            break
            case "pw",
                return L[1,string] + " - " + L[3,string] + " attempted password: " + L[4,string]
            break
        }
        
        return Log[N,string]
    }
    function void writeLog(N) {
        addText(getLog(N), vec(255), 2)
    }
    
    function void writeLogs() {
        for(I = 1, Log:count()) {
            writeLog(I)
        }
    }
    
    function void showGroup(Group:string) {
        for(I = Data["EGP Groups",table][Group,array][1,number], Data["EGP Groups",table][Group,array][2,number]) {
            local Alph = Data["EGP Alphas",array][I,number]
            Alph = Alph == 0 ? 255 : Alph-1
            EGP:egpAlpha(I, Alph)
        }
    }
    
    function void setDisplay() {
        
        for(I = Data["EGP Groups",table]["Game Data",array][1,number], Disp["Highest Object I",number]) {
            EGP:egpRemove(I)
        }
        Disp["Highest Object I",number] = 0
        
        if( Disp["Mode",string] == "Login" ) {
            showGroup("Login")
            for(I = Data["EGP Password I",number], Data["EGP Password Chars",number] + Data["EGP Password I",number]) {
                EGP:egpAlpha(I,0)
            }
        }
        elseif( Disp["Mode",string] == "Logged in" ) {
            # hide login screen
            for(I = Data["EGP Groups",table]["Login",array][1,number], Data["EGP Groups",table]["Login",array][2,number]) {
                EGP:egpAlpha(I,0)
            }
            
            if(!Data["Admin",number]) {
                Text["Text",table] = table()
            }
            elseif(Text["Text",table]:count() != 0) {
                addText(" ")
                addText(" ")
            }
            
            #if(Text["Text",table]:count() == 0) {
            addText("- Welcome, "+User:name()+"!",vec(200))
            addText("-  Type 'help' for a list of commands.", vec(200))
            if(Update["UpdateAvail",number]) {
                addText("-  A new update is available!", vec(255,200,200))
            }
            elseif(Update["ShouldUpdate",number]) {
                addText("-  It has been at least a week since the last update. You should check for a new update!", vec(255,200,200),5)
            }
            updateConsole()
            #}
            
            Disp["Mode",string] = "Console"
        }
    }
    
    ##########################################################################################
    #                       Minesweeper functions - ms
    ##########################################################################################
    
    function number gmsCountMines(X,Y) {
        local M = 0
        
        for(YI = Y-1 , Y+1) {
            for(XI = X-1, X+1) {
                if(XI==X & YI==Y) { continue }
                if(XI > 9 | XI < 0 | YI > 9 | YI < 0) { continue }
                if(int(Game["Tiles",array][XI + YI*10 + 1, number]) == -1) {
                    M++
                }
            }
        }
        
        return M
    }
    
    function vector gmsMineNumCol(N) {
        switch(N) {
            case 1,     return vec(0,0,255)     break
            case 2,     return vec(0,128,0)     break
            case 3,     return vec(255,0,0)     break
            case 4,     return vec(0,0,128)     break
            case 5,     return vec(128,0,0)     break
            case 6,     return vec(0,128,128)   break
            case 7,     return vec()            break
            case 8,     return vec(100)         break
            
            default,
                print("Error: attempted to get color for " + N + " mines.")
                return vec()
            break
        }
    }
    
    function void gmsPlaceMines(FX, FY) {
        for(I = 1, Game["Mines",number]) {
            local Placed = 0
            while(!Placed) {
                local X = randint(0,9)
                local Y = randint(0,9)
                
                if(FX == X & FY == Y) {
                    continue
                }
                
                local ThisTile = Game["Tiles",array][X + Y*10 + 1, number]
                if(ThisTile != -1) {
                    Placed = 1
                    Game["Tiles",array][X + Y*10 + 1, number] = -1
                    Game["MinesPoss",array]:pushVector2(vec2(X,Y))
                }
            }
        }
    }
    
    
    ##########################################################################################
    #                   Tetris Functions
    ##########################################################################################
    
    function void gtetShowPreview() {} #prototype function
    
    function number gtetAddBlock(N) {
        local Next = Game["UpNext",number]
        Game["UpNext",number] = N
        EGP:egpColor(Game["BorderBox I",number], Game["Colors",array][Next,vector])
        Game["MoveCent",number] = 0
        
        local CX = ceil(Game["Width",number]/2)
        local CY = 2
        
        local Hit = 0
        for(Y = -1, 1) {
            for(X = -1, 2) {
                local Pos = vec2(CX+X,CY+Y)
                local CurI = Game["Pieces",table][Next,table][Y+2,array][X+2,number]
                
                if(CurI != 0) {
                    Game["Moving",table]:pushArray(array(Pos,Next))
                    if(CurI == 2) {
                        Game["MoveCent",number] = Game["Moving",table]:count()
                    }
                    if(Game["Rows",table][Pos:y(),array][Pos:x(),number] != 0) {
                        Hit = 1
                    }
                }
            }
        }
        
        for(I = 1, Game["Moving",table]:count()) {
            EGP:egpAlpha(I-1+Game["Preview I",number], 255)
        }
        
        gtetShowPreview()
        
        return !Hit
    }
    
    function void gtetDrawBoard() {
        
        for(I = 0, Game["Width",number] * Game["Height",number]-1) {
            local CurCol = Game["Rows",table][floor(I/Game["Width",number])+1,array][I%Game["Width",number]+1,number]
            EGP:egpAlpha(Game["BlockI",number]+I, CurCol == 0 ? 0 : 255)
            if(CurCol != 0) {
                EGP:egpColor(Game["BlockI",number]+I, Game["Colors",array][CurCol,vector])
            }
        }
        
        for(I = 1, Game["Moving",table]:count()) {
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            
            local IPos = CurPos:x()-1 + (CurPos:y()-1)*Game["Width",number]
            #print(IPos+Game["BlockI",number] + ", " + Game["Colors",array][CurCol,vector])
            EGP:egpColor(IPos+Game["BlockI",number], Game["Colors",array][CurCol,vector])
            EGP:egpAlpha(IPos+Game["BlockI",number],255)
        }
        
        local Shortest = 10000
        #Game["Preview I",number]
        for(I = 1, Game["Moving",table]:count()) {
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            
            local Hit = Game["Height",number]
            for(J = CurPos:y()+1, Game["Height",number]) {
                if(Game["Rows",table][J,array][CurPos:x(),number] != 0) {
                    Hit = J-1
                    break
                }
            }
            
            if(Shortest > Hit - CurPos:y()) {
                Shortest = Hit - CurPos:y()
            }
        }
        
        for(I = 1, Game["Moving",table]:count()) {
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            EGP:egpPos(Game["Preview I",number]+I-1, EGP:egpPos(Game["BlockI",number] + CurPos:x()-1 + (CurPos:y()-1+Shortest)*Game["Width",number]))
            EGP:egpColor(Game["Preview I",number]+I-1, Game["Colors",array][CurCol,vector])
        }
    }
    
    function void lowerMoving() {
        local NewMoving = table()
        for(I = 1, Game["Moving",table]:count()) {
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            
            NewMoving:pushArray( array(CurPos+vec2(0,1), CurCol))
        }
        Game["Moving",table] = NewMoving
    }
    
    function void checkFullRows() {
        local Fulls = array()
        local LowestRow = -1
        for(I = 1, Game["Rows",table]:count()) {
            local Empty = 0
            for(J = 1, Game["Width",number]) {
                if(Game["Rows",table][I,array][J,number] == 0) {
                    Empty = 1
                    break
                }
            }
            
            if(!Empty) {
                if(I > LowestRow) {
                    LowestRow = I
                }
                Fulls:pushNumber(I)
            }
        }
        
        for(I = Fulls:count(), 1, -1) {
            Game["Rows",table]:removeArray(Fulls[I,number])
        }
        
        for(I = Game["Rows",table]:count(), Game["Height",number]-1) {
            Game["Rows",table]:insertArray(1,array())
        }
        
        if(Fulls:count() > 0) {
            local RowsClearedScore = array(40,100,300,1200)[Fulls:count(),number]
            Game["Score",number] = Game["Score",number] + RowsClearedScore*(Game["Height",number]-LowestRow+1)
            EGP:egpSetText(Game["EGP Score I",number], "" + Game["Score",number])
        }
    }
    
    function void commitMoving() {
        for(I = 1, Game["Moving",table]:count()) {
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            
            Game["Rows",table][CurPos:y(),array][CurPos:x(),number] = CurCol
        }
        
        Game["Moving",table] = table()
        
        checkFullRows()
        
        for(I = 1, 4) {
            EGP:egpAlpha(I-1+Game["Preview I",number], 0)
        }
    }
    
    function number shiftMoving(Dir) {
        local Hit = 0
        local NewMove = table()
        
        for(I = 1, Game["Moving",table]:count()) {
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            
            if(Game["Rows",table][CurPos:y(),array][CurPos:x()+Dir,number] != 0 | CurPos:x()+Dir < 1 | CurPos:x()+Dir > Game["Width",number]) {
                Hit = 1
            }
            else {
                NewMove:pushArray(array(CurPos+vec2(Dir,0), CurCol))
            }
        }
        
        if(!Hit) {
            Game["Moving",table] = NewMove
        }
        
        return !Hit
    }
    
    function number rotateMoving() {
        
        if(Game["MoveCent",number] == 0) {
            return 1
        }
        
        local NewMove = table()
        local MC = Game["Moving",table][Game["MoveCent",number],array][1,vector2]
        local Instr = ""
        
        for(I = 1, Game["Moving",table]:count()) {
            if(I == Game["MoveCent",number]) {
                NewMove:pushArray(Game["Moving",table][I,array])
                continue
            }
            local CurPos = Game["Moving",table][I,array][1,vector2]
            local CurCol = Game["Moving",table][I,array][2,number]
            
            local LocalPos = CurPos - MC
            
            local NewPos = MC + vec2(-LocalPos:y(), LocalPos:x())
            
            
            NewMove:pushArray( array( NewPos, CurCol))
            
            if(NewPos:x() < 1) {
                Instr = "X" + (1-NewPos:x())
            }
            elseif(NewPos:x() > Game["Width",number]) {
                Instr = "X" + (Game["Width",number]-NewPos:x())
            }
            elseif(NewPos:y() > Game["Height",number]) {
                Instr = "Nope"
                break
            }
            
        }
        
        if(Instr == "Nope") {
            return 0
        }
        
        local OldMove = Game["Moving",table]:clone()
        Game["Moving",table] = NewMove
        if(Instr:index(1) == "X") {
            if(!shiftMoving(Instr:sub(2):toNumber())) {
                Game["Moving",table] = OldMove
            }
        }
        
        
        return 0
    }
    
    function void gtetShowPreview() {
        local EI = 1
        if(Game["UpNext",number] == 7) {
            for(I = -3, 3, 2) {
                EGP:egpPos(Game["EGP Next I",number]+EI, Game["Next Cent",vector2]+vec2(Game["Size",number]*I/2,0))
                EGP:egpColor(Game["EGP Next I",number]+EI, Game["Colors",array][7,vector])
                EI++
            }
        }
        elseif(Game["UpNext",number] == 1) {
            for(Y = -1, 1, 2) {
                for(X = -1, 1, 2) {
                    EGP:egpPos(Game["EGP Next I",number]+EI, Game["Next Cent",vector2]+vec2(X,Y)*Game["Size",number]/2)
                    EGP:egpColor(Game["EGP Next I",number]+EI, Game["Colors",array][1,vector])
                    EI++
                }
            }
        }
        else {
            for(Y = 1, 2) {
                for(X = 1, 3) {
                    if(Game["Pieces",table][Game["UpNext",number], table][Y,array][X,number] != 0) {
                        EGP:egpPos(Game["EGP Next I",number]+EI, Game["Next Cent",vector2] +vec2(X-2,Y-1.5)*Game["Size",number])
                        EGP:egpColor(Game["EGP Next I",number]+EI, Game["Colors",array][Game["UpNext",number],vector])
                        EI++
                    }
                }   
            }
        }
    }
    
    ##########################################################################################
    #                   2048 Functions
    ##########################################################################################
    
    function number addTile(N) {
        local FoundNew = 0
        
        while(!FoundNew & perf(MP)) {
            local Rand = randint(1,16)
            
            if(Game["Tiles",array][Rand,number] == 0) {
                Game["Tiles",array][Rand,number] = N
                FoundNew = 1
            }
        }
        
        if(!FoundNew) {
            local R = array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)
            for(J = 1, 2) {
                for(I = 1, 16) {
                    local Temp = R[I,number]
                    local Rand = randint(1,16)
                    R[I,number] = R[Rand,number]
                    R[Rand,number] = Temp
                }
            }
            
            for(I = 1, 16) {
                if(Game["Tiles",array][R[I,number],number] == 0) {
                    Game["Tiles",array][R[I,number],number] = N
                    FoundNew = 1
                    break
                }
            }
        }
        
        return FoundNew
    }
    
    function number addTile() {
        
        return addTile( random() <= 0.1 ? 2 : 1 )
    }
    
    function void showTiles() {
        for(I = 1, 16) {
            local Tile = Game["Tiles",array][I,number]
            local EI = Game["EGP Board I",number]+I
            EGP:egpColor(EI, Game["Colors",array][Tile < 13 ? Tile : 12,vector])
            
            if(Tile == 0) {
                EGP:egpAlpha(EI+16, 0)
            }
            else {
                EGP:egpAlpha(EI+16, 255)
                EGP:egpSetText(EI+16, "" + (2^Tile))
                local NLen = ("" + (2^Tile)):length()
                EGP:egpSize(EI+16, Game["PSize",number]/ (NLen <= 2 ? 1 : (NLen-1)*0.63) *0.75)
                if(Tile < 3) {
                    EGP:egpColor(EI+16, Game["Colors",array][13,vector])
                }
                else {
                    EGP:egpColor(EI+16, Game["Colors",array][14,vector])
                }
            }
        }
    }
    
    function number shiftTiles(Dir) { # N1 E2 S3 W4
        
        local Shifted = 0
        
        timer("ShiftTiles",Game["ShiftLag",number])
        
        local Inc = 2
        if(Dir == 1) {
            EGP:egpPos(Game["EGP Board I",number], Game["Cent",vector2] + vec2(0, -Game["ShiftOffset",number]))
            for(X = 0, 3) {
                for(Y = 1, 3) { 
                    if(Game["Tiles",array][X+Y*4+1,number] == 0) {
                        continue
                    }
                    #local ShiftN = Game["Tiles",array][X+Y*4+1,number]
                    local ShiftY = Y
                    for(Y2 = Y-1, 0, -1) {
                        if(Game["Tiles",array][X+Y2*4+1,number] == 0) {
                            Game["Tiles",array][X+Y2*4+1,number] = Game["Tiles",array][X+ShiftY*4+1,number]
                            Game["Tiles",array][X+ShiftY*4+1,number] = 0
                            ShiftY--
                            Shifted = 1
                        }
                        elseif(Game["Tiles",array][X+Y2*4+1,number] == Game["Tiles",array][X+ShiftY*4+1,number]) {
                            Game["Tiles",array][X+Y2*4+1,number] = Game["Tiles",array][X+Y2*4+1,number]+1+(1/Inc)
                            Game["Score",number] = Game["Score",number] + 2^int(Game["Tiles",array][X+Y2*4+1,number])
                            Inc++
                            Game["Tiles",array][X+ShiftY*4+1,number] = 0
                            ShiftY--
                            Shifted = 1
                        }
                        else {
                            break
                        }
                    }
                }
            }
        }
        elseif(Dir == 3) {
            EGP:egpPos(Game["EGP Board I",number], Game["Cent",vector2] + vec2(0, Game["ShiftOffset",number]))
            for(X = 0, 3) {
                for(Y = 2, 0, -1) { 
                    if(Game["Tiles",array][X+Y*4+1,number] == 0) {
                        continue
                    }
                    #local ShiftN = Game["Tiles",array][X+Y*4+1,number]
                    local ShiftY = Y
                    for(Y2 = Y+1, 3) {
                        if(Game["Tiles",array][X+Y2*4+1,number] == 0) {
                            Game["Tiles",array][X+Y2*4+1,number] = Game["Tiles",array][X+ShiftY*4+1,number]
                            Game["Tiles",array][X+ShiftY*4+1,number] = 0
                            ShiftY++
                            Shifted = 1
                        }
                        elseif(Game["Tiles",array][X+Y2*4+1,number] == Game["Tiles",array][X+ShiftY*4+1,number]) {
                            Game["Tiles",array][X+Y2*4+1,number] = Game["Tiles",array][X+Y2*4+1,number]+1+(1/Inc)
                            Game["Score",number] = Game["Score",number] + 2^int(Game["Tiles",array][X+Y2*4+1,number])
                            Inc++
                            Game["Tiles",array][X+ShiftY*4+1,number] = 0
                            ShiftY++
                            Shifted = 1
                        }
                        else {
                            break
                        }
                    }
                }
            }
        }
        elseif(Dir == 2) {
            EGP:egpPos(Game["EGP Board I",number], Game["Cent",vector2] + vec2(Game["ShiftOffset",number],0))
            for(Y = 0, 3) {
                for(X = 2, 0, -1) { 
                    if(Game["Tiles",array][X+Y*4+1,number] == 0) {
                        continue
                    }
                    #local ShiftN = Game["Tiles",array][X+Y*4+1,number]
                    local ShiftX = X
                    for(X2 = X+1, 3) {
                        if(Game["Tiles",array][X2+Y*4+1,number] == 0) {
                            Game["Tiles",array][X2+Y*4+1,number] = Game["Tiles",array][ShiftX+Y*4+1,number]
                            Game["Tiles",array][ShiftX+Y*4+1,number] = 0
                            ShiftX++
                            Shifted = 1
                        }
                        elseif(Game["Tiles",array][X2+Y*4+1,number] == Game["Tiles",array][ShiftX+Y*4+1,number]) {
                            Game["Tiles",array][X2+Y*4+1,number] = Game["Tiles",array][X2+Y*4+1,number]+1+(1/Inc)
                            Game["Score",number] = Game["Score",number] + 2^int(Game["Tiles",array][X2+Y*4+1,number])
                            Inc++
                            Game["Tiles",array][ShiftX+Y*4+1,number] = 0
                            ShiftX++
                            Shifted = 1
                        }
                        else {
                            break
                        }
                    }
                }
            }
        }
        elseif(Dir == 4) {
            EGP:egpPos(Game["EGP Board I",number], Game["Cent",vector2] + vec2(-Game["ShiftOffset",number],0))
            for(Y = 0, 3) {
                for(X = 1, 3) { 
                    if(Game["Tiles",array][X+Y*4+1,number] == 0) {
                        continue
                    }
                    #local ShiftN = Game["Tiles",array][X+Y*4+1,number]
                    local ShiftX = X
                    for(X2 = X-1, 0, -1) {
                        if(Game["Tiles",array][X2+Y*4+1,number] == 0) {
                            Game["Tiles",array][X2+Y*4+1,number] = Game["Tiles",array][ShiftX+Y*4+1,number]
                            Game["Tiles",array][ShiftX+Y*4+1,number] = 0
                            ShiftX--
                            Shifted = 1
                        }
                        elseif(Game["Tiles",array][X2+Y*4+1,number] == Game["Tiles",array][ShiftX+Y*4+1,number]) {
                            Game["Tiles",array][X2+Y*4+1,number] = Game["Tiles",array][X2+Y*4+1,number]+1+(1/Inc)
                            Game["Score",number] = Game["Score",number] + 2^int(Game["Tiles",array][X2+Y*4+1,number])
                            Inc++
                            Game["Tiles",array][ShiftX+Y*4+1,number] = 0
                            ShiftX--
                            Shifted = 1
                        }
                        else {
                            break
                        }
                    }
                }
            }
        }
        
        
        for(I = 1, 16) {
            Game["Tiles",array][I,number] = int(Game["Tiles",array][I,number])
        }
        
        EGP:egpSetText(Game["EGP Score I",number], "Score: " + Game["Score",number])
        
        return Shifted
    }
    
    function number g2048CheckGameOver() {
        
        for(Y = 0, 3) {
            for(X = 1, 2) {
                for(Off = (X==1 ? -1 : 1), 1, 2) {
                    if(Game["Tiles",array][X+Y*4+1,number] == Game["Tiles",array][X+Off + Y*4 + 1,number]) {
                        return 0
                    }
                }
            }
        }
        
        for(X = 0, 3) {
            for(Y = 1, 2) {
                for(Off = (Y==1 ? -1 : 1), 1, 2) {
                    if(Game["Tiles",array][X+Y*4+1,number] == Game["Tiles",array][X + (Y+Off)*4 + 1,number]) {
                        return 0
                    }
                }
            }
        }
        
        return 1
    }
    
    function number g2048AnyOpenings() {
        for(I = 1, 16) {
            if(Game["Tiles",array][I,number] == 0) {
                return 1
            }
        }
        return 0
    }
    ##########################################################################################
    #             Tic-Tac-Toe Game Functions
    ##########################################################################################
    
    function number placePiece(Spot, PlayerN, Cheat) {
        local Placed = 0
        if(Game["Tiles",array][Spot,number] == 0 | Cheat) {
            Game["Cheat",number] = 0
            Placed = 1
            Game["Tiles",array][Spot,number] = PlayerN
            EGP:egpAlpha(Game["EGP Box I",number]+Spot-1, 255)
            EGP:egpMaterial(Game["EGP Box I",number]+Spot-1, PlayerN == 1 ? Game["Mat1",string] : Game["Mat2",string])
            Game["Turn",number] = Game["Turn",number]%2+1
            #EGP:egpAlpha(Game["EGP YT I",number], (PlayerN != Game["Player",number])*255)
            EGP:egpColor(Game["EGP YT I",number], vec((Game["Player",number] == Game["Turn",number])*205+50))
        }
        
        return Placed
    }
    
    function void drawWinnerLine(Ply, Dir1, Dir2) {
        #dir1
        # 1 = horiz
        # 2 = vert
        # 3 = diag
        
        #dir2
        # n = row
        
        EGP:egpAlpha(Game["EGP Winner I",number], 255)
        local Offset = vec2(0, Dir2-1)
        EGP:egpAngle(Game["EGP Winner I",number], 0)
        if(Dir1 == 2) {
            Offset = vec2(Offset:y(), Offset:x())
            EGP:egpAngle(Game["EGP Winner I",number], 90)
        }
        elseif(Dir1 == 3) {
            Offset = vec2()
            EGP:egpAngle(Game["EGP Winner I",number], -45 + (Dir2-1)*90)
        }
        local Pos = Game["Cent",vector2] + Offset*125
        
        EGP:egpPos(Game["EGP Winner I",number], Pos)
        #EGP:egpAlpha(Game["EGP YT I",number], 0)
        EGP:egpColor(Game["EGP YT I",number], vec(255))
        EGP:egpSetText(Game["EGP YT I",number], "You " + (Ply == Game["Player",number] ? "Win!" : "Lose!"))
        
        if(Ply == Game["Player",number]) {
            Game["Wins",number] = Game["Wins",number] + 1
            EGP:egpSetText(Game["EGP WL I",number], "W: " + Game["Wins",number])
        }
        else {
            Game["Losses",number] = Game["Losses",number] + 1
            EGP:egpSetText(Game["EGP WL I",number]+1, "L: " + Game["Losses",number])
        }
    }
    
    function void checkGameOver() {
        local Winner = 0
        local T = Game["Tiles",array]
        
        for(J = 1, 2) {
            
            for(Y = 0, 2) {
                local F1 = 0
                local F2 = 0
                for(X = 0, 2) {
                    local Pos = vec2()
                    if(J == 1) {
                        Pos = vec2(X,Y)
                    } else {
                        Pos = vec2(Y,X)
                    }
                    
                    local Num = T[Pos:x() + Pos:y()*3 + 1, number]
                    
                    if(Num == 1) {
                        F1++
                    }
                    elseif(Num == 2) {
                        F2++
                    }
                }
                
                if(F1 == 3) {
                    drawWinnerLine(1,J,Y)
                    Winner = 1
                    break
                }
                elseif(F2 == 3) {
                    drawWinnerLine(2,J,Y)
                    Winner = 2
                    break
                }
            }
            
            if(Winner) {
                break
            }
            
        }
        
        if(!Winner) {
            if(T[1+0,number] == T[2+3,number] & T[2+3,number] == T[3+6,number] & T[1,number] != 0) {
                drawWinnerLine(T[1,number], 3, 1)
                Winner = T[1,number]
            }
            elseif( T[3+0,number] == T[2+3,number] & T[2+3,number] == T[1+6,number]& T[3,number] != 0) {
                drawWinnerLine(T[3,number], 3, 2)
                Winner = T[1,number]
            }
        }
            
                
        
        if(!Winner) {
            Winner = -1
            for(I = 1, 9) {
                if(Game["Tiles",array][I,number] == 0) {
                    Winner = 0
                    break
                }
            }
        }
        
        if(Winner != 0) {
            Game["GameOver",number] = 1
            
            if(Winner == -1) {
                EGP:egpColor(Game["EGP YT I",number], vec(255))
                EGP:egpSetText(Game["EGP YT I",number], "Cat's Game")
            }
        }
                 
        
    }
    
    ##########################################################################################
    #             Zork Functions
    ##########################################################################################
    
    
    
    ##########################################################################################
    #             Default Game Functions
    ##########################################################################################
    
    function void showArrow(Show) {
        if(Show) {
            EGP:egpCircle(997,vec2(),vec2()) 
            EGP:egpBox(998,vec2(16),vec2(40))
                EGP:egpMaterial(998,"vgui/cursors/arrow")
                
                
            EGP:egpParent(998,997)
            EGP:egpParentToCursor(997)
        }
        else {
            EGP:egpRemove(997)
            EGP:egpRemove(998)
        }
    }
    
    function void resetGame() { #asdf
        switch(Game["Name",string]) {
            case "minesweeper",
                
                Game["Stack",table] = table()
                Game["Gameover",number] = 0
                Game["MinesPoss",array] = array()
                Game["Flags",number] = 0
                Game["Cleared",number] = 0
                
                Game["Tiles",array] = array()
                
                
                local Siz = 10
                local EI = Game["Root Tile",number]
                
                for(Y = 1, Siz) {
                    for(X = 1, Siz) {
                        EGP:egpMaterial(EI,"glass/offlightcover")
                        EGP:egpColor(EI,vec(255))
                        EGP:egpColor(EI+100,vec())
                        EGP:egpSetText(EI+200,"")
                        EGP:egpAlpha(EI+300,0)
                        EGP:egpAlpha(EI+400,0)
                        Game["Tiles",array]:pushNumber(0)
                        EI++
                    }
                }
                
                
                EGP:egpSetText(Game["FlagTextI",number], ":00")
            break
            
            case "tetris",
                Game["AddBlock",number] = 1
                Game["GameOver",number] = 0
                stoptimer("Tetris")
                timer("Tetris",2000)
                
                Game["Rows",table] = table()
                
                for(I = 1, Game["Height",number]) {
                    Game["Rows",table][I,array] = array()
                }
                for(I = 0, 3) {
                    EGP:egpAlpha(Game["Preview I",number]+I,0)
                }
                EGP:egpColor(Game["BorderBox I",number], vec(100))
                Game["Moving",table] = table()
                Game["MoveCent",number] = 0
                
                gtetDrawBoard()
            break
            
            case "2048",
                Game["Tiles",array] = array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
                Game["GameOver",number] = 0
                Game["Score",number] = 0
                Game["CanShift",number] = 1
                EGP:egpSetText(Game["EGP Score I",number], "Score: 0")
                
                addTile(1)
                addTile(1)
                showTiles()
            break
            
            case "tic tac toe",
                Game["Tiles",array] = array(0,0,0,0,0,0,0,0,0)
                Game["Turn",number] = Game["StartTurn",number]%2+1
                Game["StartTurn",number] = Game["Turn",number]
                Game["GameOver",number] = Game["Friend UID", string] == "null"
                EGP:egpAlpha(Game["EGP Winner I",number], 0)
                #EGP:egpAlpha(Game["EGP YT I",number], (Game["Turn",number] == Game["Player",number])*255)
                #EGP:egpSetText(Game["EGP YT I",number], "Your Turn")
                
                EGP:egpSetText(Game["EGP YT I",number], Game["Friend UID", string] == "null" ? "Searching. . ." : "Your Turn")
                EGP:egpColor(Game["EGP YT I",number], vec((Game["Player",number] == Game["Turn",number])*205+50))
                
                for(I = 0, 8) {
                    EGP:egpAlpha(Game["EGP Box I",number]+I,0)
                }
                
            break
            
            case "zork",
                Game = table()
                timer("Setup Game zork", 100)
                Disp["Mode",string] = "Setup Game"
            break
        }
    }
    
    function void sendReset() {
        switch(Game["Name",string]) {
            case "tic tac toe",
                dsSend(Game["Name",string] + " " + Game["Friend UID",string], "MayOS v2", "reset")
            break
        }
    }
    
    function void sendQuit() {
        switch(Game["Name",string]) {
            case "tic tac toe",
                dsSend(Game["Name",string] + " " + Game["Friend UID",string], "MayOS v2", "quit")
            break
        }
    }
    
    function void sendPlyName(Name:string) {
        switch(Game["Name",string]) {
            case "tic tac toe",
                dsSend(Game["Name",string] + " " + Game["Friend UID",string], "MayOS v2", "n:" + Name)
            break
        }
    }
    
    function number setupGame(Str:string) {
        local GameN = Str:sub("Setup Game  ":length())  #Str:explode(" ")[3,string]
        
        if(Game["Setup",number] == 0) {
            Game["Setup",number] = 1
        }
        
        while(perf(MP) & Game["Setup",number] > 0) {
            switch(GameN:explode(" ")[1,string]) {
                case "minesweeper",
                    switch(Game["Setup",number]) {
                        case 1,
                            Game["Name",string] = "minesweeper"
                            Game["Stack",table] = table()
                            Game["Gameover",number] = 0
                            Game["MinesPoss",array] = array()
                            Game["Flags",number] = 0
                            Game["Cleared",number] = 0
                            Game["Mines",number] = Str:explode(" ")[Str:explode(" "):count(),string]:toNumber()#Cmds:toNumber()
                                if(Game["Mines",number] <= 0) { Game["Mines",number] = 10 }
                                if(Game["Mines",number] >= 100) { Game["Mines",number] = 99 }
                            Game["Tiles",array] = array()
                            
                            local EI = Data["EGP Groups",table]["Game Data",array][1,number]
                            Game["StartEI",number] = EI
                            
                            EGP:egpBox(EI,vec2(256),vec2(512))
                                EGP:egpColor(EI,vec())
                            EGP:egpBox(EI+1,vec2(256),vec2(512))
                                EGP:egpMaterial(EI+1,"skybox/militia_hdrup")
                            EGP:egpPoly(EI+2, array( vec2(175-140,40), vec2(175+140,40), vec2(175+140+50,40+50), vec2(175-140+50,40+50)))
                                EGP:egpColor(EI+2, vec(40))
                            EGP:egpPoly(EI+3, array( vec2(459, 495), vec2(509, 492), vec2(509, 404), vec2(458, 360)))
                                EGP:egpColor(EI+3, vec(40))
                            
                            EGP:egpCircle(EI+4, vec2(60,400), vec2(57))
                                EGP:egpColor(EI+4, vec(40))
                            EGP:egpCircle(EI+5, vec2(50,330), vec2(32))
                                EGP:egpColor(EI+5, vec(40))
                            EGP:egpBox(EI+7, vec2(50,360), vec2(64,64))
                                EGP:egpColor(EI+7, vec(40))
                            
                            Game["GearI",number] = EI+8
                            EGP:egpBox(EI+8, EGP:egpPos(EI+4), vec2(100))
                                EGP:egpMaterial(EI+8,"expression 2/cog_prop")
                            EGP:egpBox(EI+9, EGP:egpPos(EI+5), vec2(50))
                                EGP:egpMaterial(EI+9, "expression 2/cog_prop")
                            EI+=10
                            EGP:egpRoundedBox(EI, vec2(420, 60), vec2(120,110))
                                EGP:egpRadius(EI,5)
                                EGP:egpColor(EI,vec(40))
                            EGP:egpRoundedBox(EI+1, EGP:egpPos(EI)+vec2(-50,0),vec2(14,100))
                                EGP:egpColor(EI+1, vec(140))
                                EGP:egpRadius(EI+1,5)
                            
                            EGP:egpCircle(EI+8,EGP:egpPos(EI)+vec2(-25,-35), vec2(10))
                                EGP:egpColor(EI+8, vec(255,100,100))
                                EGP:egpMaterial(EI+8,"gui/gradient_up")
                            EGP:egpBox(EI+2,EGP:egpPos(EI)+vec2(-25,-35), vec2(30))
                                EGP:egpMaterial(EI+2, "effects/fire_cloud1")
                            EGP:egpCircle(EI+3,EGP:egpPos(EI)+vec2(-25,-35), vec2(50,25)/2)
                                EGP:egpMaterial(EI+3,"vgui/entities/weapon_mad_admin")
                            EGP:egpRoundedBox(EI+4,EGP:egpPos(EI)+vec2(-25,-2), vec2(25))
                                EGP:egpColor(EI+4, vec(170))
                                EGP:egpRadius(EI+4, 4)
                            EGP:egpBox(EI+5, EGP:egpPos(EI)+vec2(-25,-4), vec2(63))
                                EGP:egpMaterial(EI+5,"gui/legs1")
                            
                            EGP:egpText(EI+6, ":"+Game["Mines",number],EGP:egpPos(EI)+vec2(-5,-35))
                                EGP:egpAlign(EI+6,0,1)
                                EGP:egpFont(EI+6,"Courier New", 30)
                            Game["FlagTextI",number] = EI+7
                            EGP:egpText(EI+7, ":00",EGP:egpPos(EI)+vec2(-5,-4))
                                EGP:egpAlign(EI+7,0,1)
                                EGP:egpFont(EI+7,"Courier New", 30)
                                
                            EI+=9
                            
                            Game["EGP Cheat I",number] = EI
                            EGP:egpBox(EI,vec2(),vec2(4))
                                EGP:egpColor(EI,vec4(0,0,60,0))
                            EI++
                            
                            # mine tile backdrop
                            EGP:egpBox(EI,vec2(256,256+30), vec2(430))
                                EGP:egpColor(EI, vec(150))
                            EGP:egpBoxOutline(EI+1,vec2(256,256+30), vec2(430))
                                EGP:egpColor(EI+1, vec(40))
                                EGP:egpSize(EI+1,3)
                            EI+=2
                            
                            local Siz = 10
                            local PS = 375/(Siz-1)
                            local AS = 375/(Siz-1)
                            Game["Root Tile",number] = EI
                            for(Y = 1, Siz) {
                                for(X = 1, Siz) {
                                    EGP:egpBox(EI, vec2(69,100) + floor(vec2((X-1),(Y-1))*PS), vec2(floor(AS)))
                                        EGP:egpColor(EI,vec(255))
                                        EGP:egpMaterial(EI,"glass/offlightcover")
                                    EGP:egpBoxOutline(EI+100,EGP:egpPos(EI),vec2(floor(AS-1)))
                                        EGP:egpColor(EI+100,vec())
                                    EGP:egpText(EI+200, "", EGP:egpPos(EI))
                                        EGP:egpColor(EI+200,vec())
                                        EGP:egpAlign(EI+200,1,1)
                                        EGP:egpFont(EI+200,"Courier New",floor(AS*0.9))
                                    EGP:egpBox(EI+300, EGP:egpPos(EI), vec2(floor(AS*2),floor(AS)))
                                        EGP:egpMaterial(EI+300,"vgui/entities/weapon_mad_admin")
                                        EGP:egpAlpha(EI+300,0)
                                    EGP:egpBox(EI+400, EGP:egpPos(EI), vec2(floor(AS*2)))                    
                                        EGP:egpMaterial(EI+400, "gui/legs1")
                                        EGP:egpAlpha(EI+400,0)
                                    
                                    Game["Tiles",array]:pushNumber(0)
                                    EI++
                                }
                            }
                            EI+=400
                            Game["CurEI",number] = EI
                            Game["Setup",number] = 2
                        break # end 1
                        
                        case 2,
                            local EI = Game["CurEI",number]
                            Game["Exit I",number] = EI
                            EGP:egpCircle(EI,vec2(500-9, 500-30), vec2(17))
                                EGP:egpColor(EI,vec(170,0,0))
                                EGP:egpMaterial(EI, "gui/close_32")
                            EI++
                            
                            Game["Reset I",number] = EI
                            EGP:egpCircle(EI, vec2(500-9,500-74), vec2(20))
                                EGP:egpColor(EI, vec(240,240,0))
                                EGP:egpMaterial(EI,"gui/html/refresh")
                            EI++
                            
                            EGP:egpRoundedBox(EI,vec2(175,40), vec2(310,45))
                                EGP:egpColor(EI,vec(70))
                                EGP:egpRadius(EI,7)
                            EGP:egpText(EI+1, "Minesweeper", EGP:egpPos(EI))
                                EGP:egpAlign(EI+1,1,1)
                                EGP:egpFont(EI+1,"Lucida Console", 42)
                            
                            Disp["Highest Object I",number] = EI+1
                            
                            
                            
                            Game["Setup",number] = 0 # means the setup is done
                        break # end 2
                    }
                break # end minesweeper
                
                case "minesweeper2",
                    switch(Game["Setup",number]) {
                        case 1,
                            Game["Name",string] = "minesweeper2"
                            Game["Stack",table] = table()
                            Game["Gameover",number] = 0
                            Game["MinesPoss",array] = array()
                            Game["Flags",number] = 0
                            Game["Cleared",number] = 0
                            switch(GameN:explode(" ")[2,string]) {
                                case "easy",
                                    Game["Mines",number] = 10
                                    Game["Width",number] = Game["Height",number] = 9
                                break
                                case "hard",
                                    Game["Mines",number] = 99
                                    Game["Width",number] = Game["Height",number] = 21
                                break
                                
                                default,
                                    Game["Mines",number] = 40
                                    Game["Width",number] = Game["Height",number] = 16
                                break
                            }
                            Game["Tiles",array] = array()
                            
                            local EI = Data["EGP Groups",table]["Game Data",array][1,number]
                            Game["StartEI",number] = EI
                            
                            Game["GBSize",number] = 450 #game board
                            
                            Game["TSize",number] = int(Game["GBSize",number]/Game["Width",number])
                            Game["PFWidth",number] = Game["Width",number]*Game["TSize",number]
                            Game["PFHeight",number] = Game["Height",number]*Game["TSize",number]
                            
                            Game["Cent",vector2] = vec2(256)
                            
                            
                            
                            EGP:egpBox(EI,vec2(256),vec2(512))
                                EGP:egpColor(EI,vec())
                            EGP:egpBox(EI+1, Game["Cent",vector2], vec2(Game["GBSize",number]))
                                EGP:egpColor(EI+1,vec(255))
                                EGP:egpAlpha(EI+1,100)
                            EI+=2
                            
                            local Grid = array()
                            
                            for(I = 0, Game["Height",number]*2) {
                                Grid:pushVector2( vec2(  Game["Cent",vector2]:x()-(Game["PFWidth",number]/2) +   ((floor(I/2)*2)%4)/2   *Game["PFWidth",number]     ,
                                    Game["Cent",vector2]:y()-(Game["PFHeight",number]/2)  +floor((I+1)/2)*Game["TSize",number]   )  )
                            }
           
                            
                            EGP:egpLineStrip(EI,Grid)
                                EGP:egpColor(EI,vec(200))
                                
                            Grid = array()
                            for(I = 0, Game["Width",number]*2) {
                                Grid:pushVector2( vec2( Game["Cent",vector2]:x()-(Game["PFWidth",number]/2)  +floor((I+1)/2)*Game["TSize",number] ,
                                    Game["Cent",vector2]:y()-(Game["PFHeight",number]/2) +   ((floor(I/2)*2)%4)/2   *Game["PFHeight",number]   )  )
                            }
                            
                            EGP:egpLineStrip(EI+1,Grid)
                                EGP:egpColor(EI+1,vec(200))
                            
                            EGP:egpBoxOutline(EI+2, Game["Cent",vector2], vec2(Game["GBSize",number]))
                                EGP:egpColor(EI+2,vec(30))
                            EI+=3
                            
                            Game["Mine",array] = array()
                            Game["Mine",array]:pushVector2(vec2())
                            for(I = 1, 25) {
                                local Mult = 1
                                if(I%4==0) {
                                    Mult = 1.5
                                }
                                Game["Mine",array]:pushVector2( vec2( sin(I*(360/24))*Game["TSize",number]/2, cos(I*(360/24))*Game["TSize",number]/2)*Mult)
                            }
                            
                            
                            
                            Game["PickupEI",number] = EI
                            Game["Setup",number] = 2
                        break #end 1
                        
                        case 2,
                            local EI = Game["PickupEI",number]
                            
                            local StartOff = Game["Cent",vector2]-vec2(Game["GBSize",number])/2+vec2(Game["TSize",number])*0.75
                            Game["RootTile",number] = EI
                            for(Y = 0, Game["Height",number]-1) {
                                for(X = 0, Game["Width",number]-1) {
                                    EGP:egpBox(EI, StartOff + vec2(X,Y)*Game["TSize",number], vec2(Game["TSize",number]-2))
                                        #EGP:egpColor(EI,vec(100))
                                        EGP:egpMaterial(EI,"gui/center_gradient")
                                    EI++
                                }
                            }
                            
                            Disp["Highest Object I",number] = EI-1
                            Game["Setup",number] = 0 # means the setup is done
                            
                        break
                        
                    }
                break #end minesweeper 2
                
                case "tetris",
                    switch(Game["Setup",number]) {
                        case 1,
                            Game["Name",string] = GameN
                            
                            Game["AddBlock",number] = 1
                            Game["GameOver",number] = 0
                            local EI = Data["EGP Groups",table]["Game Data",array][1,number]
                            Game["StartEI",number] = EI
                            
                            Game["Cent",vector2] = vec2(200,256)
                            
                            Game["Width",number] = 11
                            Game["Height",number] = 22
                            
                            Game["Size",number] = 20
                            
                            Game["PFWidth",number] = Game["Width",number]*Game["Size",number]
                            Game["PFHeight",number] = Game["Height",number]*Game["Size",number]
                            
                            Game["GameSpeed",number] = 350
                            Game["UpNext",number] = randint(1,7)
                            Game["Score",number] = 0
                            Game["Rows",table] = table()
                            
                            for(I = 1, Game["Height",number]) {
                                Game["Rows",table][I,array] = array()
                            }
                            
                            Game["Pieces",table] = table(
                                table(
                                    array(1,1), #     XX
                                    array(1,1)  #     XX
                                ),
                                table(
                                    array(0,1,0), #    X
                                    array(1,2,1), #   XXX
                                    array(0,0,0)
                                ),
                                table(
                                    array(1,1,0), #   XX
                                    array(0,2,1), #    XX
                                    array(0,0,0)
                                ),
                                table(
                                    array(0,1,1), #    XX
                                    array(1,2,0), #   XX
                                    array(0,0,0)
                                ),
                                table(
                                    array(1,0,0), #   X
                                    array(1,2,1), #   XXX
                                    array(0,0,0)
                                ),
                                table(
                                    array(0,0,1), #     X
                                    array(1,2,1), #   XXX
                                    array(0,0,0)
                                ),
                                table(
                                    array(1,2,1,1)#   XXXX
                                )
                                
                            )
                            
                            Game["Moving",table] = table()
                            Game["MoveCent",number] = 0
                            
                            Game["Colors",array] = array(
                                vec(240,240,0),
                                vec(160,0,240),
                                vec(240,0,0),
                                vec(0,240,0),
                                vec(0,0,240),
                                vec(240,160,0),
                                vec(0,240,240)
                            )
                            
                            
                            
                            EGP:egpBox(EI,vec2(256),vec2(512))
                                EGP:egpColor(EI,vec())
                            EI++
                            
                            
                            
                            local Grid = array()
                            
                            for(I = 0, Game["Height",number]*2) {
                                Grid:pushVector2( vec2(  Game["Cent",vector2]:x()-(Game["PFWidth",number]/2) +   ((floor(I/2)*2)%4)/2   *Game["PFWidth",number]     ,
                                    Game["Cent",vector2]:y()-(Game["PFHeight",number]/2)  +floor((I+1)/2)*Game["Size",number]   )  )
                            }
           
                            
                            EGP:egpLineStrip(EI,Grid)
                                EGP:egpColor(EI,vec(30))
                                
                            Grid = array()
                            for(I = 0, Game["Width",number]*2) {
                                Grid:pushVector2( vec2( Game["Cent",vector2]:x()-(Game["PFWidth",number]/2)  +floor((I+1)/2)*Game["Size",number] ,
                                    Game["Cent",vector2]:y()-(Game["PFHeight",number]/2) +   ((floor(I/2)*2)%4)/2   *Game["PFHeight",number]   )  )
                            }
                            
                            EGP:egpLineStrip(EI+1,Grid)
                                EGP:egpColor(EI+1,vec(30))
                            
                            Game["BorderBox I",number] = EI+2
                            EGP:egpBoxOutline(EI+2,Game["Cent",vector2], vec2(Game["PFWidth",number],Game["PFHeight",number]))
                                EGP:egpColor(EI+2,vec(100))
                                
                            EI+=3
                            
                            local Off = vec2(Game["PFWidth",number]/2, Game["PFHeight",number]/2) + vec2(Game["Size",number]/2)
                            
                            Game["BlockI",number] = EI
                            for(Y = 1, Game["Height",number]) {
                                for(X = 1, Game["Width",number]) {
                                    EGP:egpBox(EI, Game["Cent",vector2] - Off
                                        + vec2(X,Y)*Game["Size",number], vec2(Game["Size",number]-2))
                                    #EGP:egpMaterial(EI,"gui/center_gradient")
                                    #EGP:egpColor(EI, vec( (X-1+(Y-1)* Game["Width",number])+50  )  )
                                    EGP:egpAlpha(EI,0)
                                    
                                    EI++
                                }
                            }
                            Game["Preview I",number] = EI
                            for(I = 1, 4) {
                                EGP:egpBoxOutline(EI,vec2(), vec2(Game["Size",number]-2))
                                    EGP:egpSize(EI,2)
                                    EGP:egpAlpha(EI,0)
                                EI++
                            }
                            
                            Game["EGP Pause I",number] = EI
                            EGP:egpText(EI, "PAUSED",vec2(Game["Cent",vector2]:x(),510))
                                EGP:egpAlign(EI,1,2)
                                EGP:egpFont(EI,"Courier New", 35)
                                EGP:egpAlpha(EI,0)
                            EI++
                            
                            Game["Next Cent", vector2] = vec2(400, 150)
                            Game["EGP Next I",number] = EI
                            EGP:egpBoxOutline(EI,Game["Next Cent", vector2], vec2(160,100))
                                EGP:egpColor(EI,vec(100))
                            for(I = 1, 4) {
                                EGP:egpBox(EI+I, Game["Next Cent", vector2], vec2(Game["Size",number]-2))
                            }
                            gtetShowPreview()
                            EGP:egpText(EI+5,"Next:",Game["Next Cent", vector2]-vec2(70,52))
                                EGP:egpAlign(EI+5,0,2)
                                EGP:egpFont(EI+5,"Courier New",20)
                            EI+=6
                            
                            Game["Score Cent",vector2] = vec2(400, 360)
                            EGP:egpText(EI,"Score:",Game["Score Cent",vector2]-vec2(70,27))
                                EGP:egpAlign(EI,0,2)
                                EGP:egpFont(EI,"Courier New",20)
                            EGP:egpBoxOutline(EI+1,Game["Score Cent",vector2], vec2(160, 50))
                                EGP:egpColor(EI+1,vec(100))
                            Game["EGP Score I",number] = EI+2
                            EGP:egpText(EI+2,"0",Game["Score Cent",vector2]+vec2(77,2))
                                EGP:egpAlign(EI+2,2,1)
                                EGP:egpFont(EI+2,"Courier New", 45)
                            EI+=3
                            
                            Game["Exit I",number] = EI
                            EGP:egpCircle(EI,vec2(500-9, 500-30), vec2(17))
                                EGP:egpColor(EI,vec(170,0,0))
                                EGP:egpMaterial(EI, "gui/close_32")
                            EI++
                            
                            Game["Reset I",number] = EI
                            EGP:egpCircle(EI, vec2(500-9,500-74), vec2(20))
                                EGP:egpColor(EI, vec(240,240,0))
                                EGP:egpMaterial(EI,"gui/html/refresh")
                            EI++
                            
                            Disp["Highest Object I",number] = EI-1
                            timer("Tetris", 1000)
                            Game["Setup",number] = 0 # means the setup is done
                            
                        break # end 1
                    }
                break # end tetris
                
                case "2048",
                    switch(Game["Setup",number]) {
                        case 1,
                            Game["Name",string] = GameN
                            
                            Game["Score",number] = 0
                            Game["CanShift",number] = 1
                            Game["ShiftLag",number] = 100
                            Game["SpawnLag",number] = 300
                            Game["GameOver",number] = 0
                            local EI = Data["EGP Groups",table]["Game Data",array][1,number]
                            Game["StartEI",number] = EI
                            
                            Game["Cent",vector2] = vec2(256)
                            Game["BSize",number] = 400
                            Game["Gap",number] = 10
                            Game["PSize",number] = floor( (Game["BSize",number] - Game["Gap",number]*5) / 4 )
                            Game["ShiftOffset",number] = 20
                            
                            Game["Colors",array] = array(
                                vec(238, 228, 218), # 2
                                vec(237, 224, 200), # 4
                                vec(242, 177, 121), # 8
                                vec(245, 149,  99), # 16
                                vec(246, 124,  95), # 32
                                vec(246,  94,  59), # 64
                                vec(237, 207, 114), # 128
                                vec(237, 204,  97), # 256
                                vec(237, 200,  80), # 512
                                vec(237, 197,  63), # 1024
                                vec(237, 194,  46), # 2048
                                vec( 60,  58,  50), # 4096+
                                vec( 34), # 2,4
                                vec(249)  # 8+
                            )
                            Game["Colors",array][0,vector] = vec(204, 192, 178) #0
                            
                            Game["Tiles",array] = array()
                            for(I = 1, 16) {
                                Game["Tiles",array][I,number] = 0
                            }
                            
                            #Game["Tiles",array][2,number] = 1
                            
                            #print(g2048CheckGameOver())
                            
                            EGP:egpBox(EI,vec2(256),vec2(512))
                                EGP:egpColor(EI,vec())
                            EI++
                            
                            Game["EGP Board I",number] = EI
                            EGP:egpRoundedBox(EI,Game["Cent",vector2], vec2(Game["BSize",number]))
                                EGP:egpRadius(EI,3)
                                EGP:egpColor(EI,vec(187,173,160))
                            EI++
                            for(Y = -3, 3, 2) {
                                for(X = -3, 3, 2) {
                                    EGP:egpRoundedBox(EI, vec2(X,Y)*0.55*Game["PSize",number], vec2(Game["PSize",number]))
                                        EGP:egpRadius(EI,4)
                                        EGP:egpColor(EI, Game["Colors",array][1,vector])
                                        EGP:egpParent(EI,Game["EGP Board I",number])
                                    
                                    EGP:egpText(EI+16, "0", EGP:egpPos(EI))
                                        EGP:egpAlpha(EI+16, 0)
                                        EGP:egpAlign(EI+16,1,1)
                                        EGP:egpFont(EI+16, "Courier New", Game["PSize",number]*0.75)
                                        EGP:egpParent(EI+16, Game["EGP Board I",number])
                                    
                                    EI++
                                }
                            }
                            
                            EI+=16
                            
                            #for(I = 1, 16) {
                                #addTile(I)
                            #}
                            
                            addTile(1)
                            addTile(1)
                            
                            #[ addTile(4)
                            addTile(7)
                            addTile(10)
                            addTile(14)]#
                            showTiles()
                            
                            EGP:egpText(EI,"2048",vec2(256,2))
                                EGP:egpFont(EI,"Courier New", 60)
                                EGP:egpAlign(EI,1,0)
                            EI++
                            
                            Game["EGP Score I",number] = EI
                            EGP:egpText(EI,"Score: 0",vec2(6,510))
                                EGP:egpFont(EI,"Courier New", 40)
                                EGP:egpAlign(EI,0,2)
                            EI++
                            
                            Game["Exit I",number] = EI
                            EGP:egpCircle(EI,vec2(500-9, 500-30), vec2(17))
                                EGP:egpColor(EI,vec(170,0,0))
                                EGP:egpMaterial(EI, "gui/close_32")
                            EI++
                            
                            Game["Reset I",number] = EI
                            EGP:egpCircle(EI, vec2(500-9,500-74), vec2(20))
                                EGP:egpColor(EI, vec(240,240,0))
                                EGP:egpMaterial(EI,"gui/html/refresh")
                            EI++
                            
                            Disp["Highest Object I",number] = EI-1
                            
                            Game["Setup",number] = 0
                        break #end 1
                    }
                break # end 2048
                
                case "tic",
                    switch(Game["Setup",number]) {
                        case 1,
                            Game["Name",string] = "tic tac toe"
                            Game["Friend UID",string] = "null"
                            
                            Game["GameOver",number] = 1 # until connected
                            Game["Tiles",array] = array(0,0,0,0,0,0,0,0,0)
                            local EI = Data["EGP Groups",table]["Game Data",array][1,number]
                            Game["StartEI",number] = EI
                            Game["Turn",number] = 1
                            Game["StartTurn",number] = 1
                            Game["Cent",vector2] = vec2(256,256)
                            Game["Wins",number] = 0
                            Game["Losses",number] = 0
                            
                            Game["Mat1",string] = "vgui/notices/hint"
                            Game["Mat2",string] = "vgui/notices/error"
                            
                            EGP:egpBox(EI,vec2(256),vec2(512))
                                EGP:egpColor(EI,vec())
                            EGP:egpBox(EI+1, vec2(256, 256*1.45), vec2(910.22222,512)*1.45)
                                EGP:egpMaterial(EI+1, "vgui/appchooser/background_hl2")
                            EGP:egpRoundedBox(EI+2, Game["Cent",vector2], vec2(375))
                                EGP:egpAlpha(EI+2, 100)
                                EGP:egpColor(EI+2, vec(100))
                                EGP:egpRadius(EI+2, 20)
                            
                            EI+=3
                            
                            for(I = -1, 1, 2) {
                                EGP:egpRoundedBox(EI,Game["Cent",vector2] + vec2(I,0)*60, vec2(10,350))
                                EGP:egpRadius(EI,3)
                                EI++
                            }
                            for(I = -1, 1, 2) {
                                EGP:egpRoundedBox(EI,Game["Cent",vector2] + vec2(0,I)*60, vec2(350,10))
                                EGP:egpRadius(EI,3)
                                EI++
                            }
                            
                            Game["EGP Box I",number] = EI
                            for(Y = -1, 1) {
                                for(X = -1, 1) {
                                    EGP:egpBox(EI,Game["Cent",vector2] + vec2(X,Y)*125, vec2(75))
                                        EGP:egpAlpha(EI,0)
                                    EI++
                                }
                            }
                            
                            Game["EGP YT I",number] = EI
                            EGP:egpRoundedBox(EI+1, vec2(256,512), vec2(300,120))
                                EGP:egpColor(EI+1,vec4(30,30,30,250))
                            EGP:egpText(EI, "Searching. . .", vec2(256, 510))
                                EGP:egpAlign(EI,1,2)
                                EGP:egpFont(EI, "Courier New", 35)
                                #EGP:egpAlpha(EI, 0)
                            EI+=2
                            
                            Game["Exit I",number] = EI
                            EGP:egpCircle(EI,vec2(500-9, 500-30), vec2(17))
                                EGP:egpColor(EI,vec(170,0,0))
                                EGP:egpMaterial(EI, "gui/close_32")
                            EI++
                            
                            Game["Reset I",number] = EI
                            EGP:egpCircle(EI, vec2(500-9,500-74), vec2(20))
                                EGP:egpColor(EI, vec(240,240,0))
                                EGP:egpMaterial(EI,"gui/html/refresh")
                            EI++
                            
                            Game["EGP Winner I",number] = EI
                            EGP:egpRoundedBox(EI, Game["Cent",vector2], vec2(370,10))
                                EGP:egpColor(EI,vec4(0,255,0,0))
                                EGP:egpRadius(EI,3)
                            EI++
                            
                            Game["EGP Opp I",number] = EI
                            EGP:egpText(EI,"Opponent: null",vec2(256,512-40))
                                EGP:egpFont(EI,"Courier New",20)
                                EGP:egpAlign(EI,1,2)
                            EI++
                            
                            EGP:egpRoundedBox(EI,vec2(512,0),vec2(160,108))
                                EGP:egpColor(EI, vec4(30,30,30,250))
                            EI++
                            
                            Game["EGP WL I",number] = EI
                            EGP:egpText(EI, "W: 0", vec2(444, 5))
                                EGP:egpFont(EI, "Courier New", 20)
                            EGP:egpText(EI+1, "L: 0", vec2(444, 28))
                                EGP:egpFont(EI+1, "Courier New", 20)
                            EI+=2
                            
                            EGP:egpRoundedBox(EI,vec2(),vec2(600, 102))
                                EGP:egpColor(EI,vec4(30,30,30,250))
                            EGP:egpText(EI+1,"Tic-Tac-Toe",vec2(6,2))
                                EGP:egpFont(EI+1,"Courier New",50)
                            EI+=2
                            
                            Disp["Highest Object I",number] = EI-1
                            dsSend("findgame", "MayOS v2", Game["Name",string])
                            Game["Setup",number] = 0
                            
                        break #end 1
                    }
                break # end tic tac toe
                
                case "zork",
                    switch(Game["Setup",number]) {
                        case 1,
                            
                            addText("      -------------------------")
                            addText("")
                            addText("     ZZZZZ   OOO   RRRR   KK  KK")
                            addText("        ZZ  OO OO  RR RR  KK KK")
                            addText("       ZZ   OO OO  RR RR  KKKK")
                            addText("      ZZ    OO OO  RRRR   KK KK")
                            addText("     ZZ     OO OO  RR RR  KK  KK")
                            addText("     ZZZZZ   OOO   RR  RR KK  KK")
                            addText("")
                            addText("         A custom version  ")
                            addText("             by ElMico     ")
                            addText("      -------------------------")
                            addText("    Note: Game only ~15% complete.")
                            addText("")
                                                         
                            Game["Name",string] = "zork"
                            Game["ShowCons",number] = 1
                            Game["GameOver",number] = 0
                            
                            
                            
                            Game["Locs",table] = table()
                            Game["LocData",array] = array("Items", "Containers", "Paths", "Details")
                            function void gzoAddLoc(ID:string, Name:string, Desc:string) {
                                Game["Locs",table][ID,table] = table("Name" = Name, "Desc" = Desc)
                                Game["Locs",table][ID,table]["Items",table] = table()
                                Game["Locs",table][ID,table]["Containers",table] = table()
                                Game["Locs",table][ID,table]["Paths",table] = table()
                                Game["Locs",table][ID,table]["Details",table] = table()
                                Game["Locs",table][ID,table]["Actions",table] = table()
                                
                            }
                            
                            function void gzoAddItem(ID:string, Name:string, LocDes:string, Des:string, ExtraData:string) {
                                Game["Locs",table][ID,table]["Items",table][Name,table] = table(LocDes, Des, ExtraData)
                            }
                            
                            function void gzoAddCont(ID:string, Name:string, LocDes:string, Data:table) {
                                Game["Locs",table][ID,table]["Containers",table][Name,table] = table(1 = LocDes, "Data" = Data)
                            }
                            
                            function void gzoAddDetail(ID:string, Name:string, LocDes:string, Commands:table) {
                                Game["Locs",table][ID,table]["Details",table][Name,table] = table(LocDes, Commands)
                            }
                            
                            function void gzoAddPath(FromLoc:string, ToLoc:string, Dir:string, PathName:string, PathDes:string, TravelDes:string, Details:table) {
                                Game["Locs",table][FromLoc,table]["Paths",table][Dir,table] = table(1 = PathDes, "Name" = PathName, "ToLoc" = ToLoc, "TDesc" = TravelDes, "Details" = Details)
                            }
                            
                            function void gzoAddAction(ID:string, Condition:table, Response:table) {
                                Game["Locs",table][ID,table]["Actions",table]:pushTable(table(Condition,Response))
                            }
                            
                            function void gzoAddText(Str:string) {
                                addText("    "+Str, vec(180), 6)
                            }
                            
                            function void gzoMoveText(Str:string) {
                                addText("  "+Str, vec(200,255,200), 4)
                            }
                            
                            function void gzoAreaDescText(Str:string) {
                                addText("  "+Str, vec(200,200,255), 4)
                            }
                            
                            function void gzoDie() {
                                addText("  You are dead.", vec(255,100,100))
                                Game["GameOver",number] = 1
                            }
                            
                            function void gzoSayClothes() {
                                if(Game["Clothes",table]:count() == 0) {
                                    addText("  You aren't wearing anything of interest.", vec(200))
                                }
                                else {
                                    addText("  You are wearing:",vec(200))
                                    foreach(K, T:table = Game["Clothes",table]) {
                                        gzoAddText(K)
                                    }
                                }
                            }
                            
                            function void gzoRemoveFromContainer(Name:string) {
                                
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                foreach(K, T:table = Loc["Containers",table]) {
                                    if(T["Data",table]["Contents",table]:exists(Name)) {
                                        
                                        T["Data",table]["Contents",table]:remove(Name)
                                    }
                                }
                            }
                            
                            function void gzoTake(Item:string) {
                                if(Item == "") {
                                    gzoAddText("Take what?")
                                    return
                                }
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                foreach(K, T:table = Loc["Items",table]) {
                                    if(K:lower():find(Item)) {
                                        gzoAddText("You take the " + K)
                                        Game["Inventory",table][K,table] = Loc["Items",table]:removeTable(K)
                                        
                                        gzoRemoveFromContainer(K)
                                        return
                                    }
                                }
                                
                                gzoAddText("There is no such item in the area.")
                            }
                            
                            function void gzoLook() {
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                gzoAreaDescText(Loc["Desc",string])
                                if(Loc["Items",table]:count() > 0) {
                                    foreach(K, T:table = Loc["Items",table]) {
                                        gzoAddText("There is a " + K + " "+ T[1,string])
                                    }
                                }
                                
                                foreach(K, T:table = Loc["Containers",table]) {
                                    gzoAddText(T[1,string])
                                }
                                
                                foreach(K, T:table = Loc["Paths",table]) {
                                    gzoAddText(T[1,string])
                                }
                            }
                            
                            function void gzoInspect(Item:string) {
                                if(Item == "") {
                                    gzoAddText("Inspect what?")
                                    return
                                }
                                foreach(K, T:table = Game["Inventory",table]) {
                                    if(K:lower():find(Item)) {
                                        gzoAddText(T[2,string])
                                        return
                                    }
                                }
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                foreach(K, T:table = Loc["Items",table]) {
                                    if(K:lower():find(Item)) {
                                        gzoAddText(T[2,string])
                                        return
                                    }
                                }
                                
                                foreach(K, T:table = Loc["Paths",table]) {
                                    if(T["Name",string]:lower():find(Item)) {
                                        if(T["Details",table]:exists("FineDetail")) {
                                            gzoAddText(T["Details",table]["FineDetail",string])
                                        }
                                        else {
                                            gzoAddText(T[1,string])
                                        }
                                        return
                                    }
                                }
                                
                                gzoAddText("There is no such item in your inventory or in the area.")
                                    
                            }
                            
                            function void gzoForcePickupItem(Name:string, Data:table) {
                                Game["Inventory",table][Name,table] = Data
                            }
                            
                            function void gzoPrivateCommand(Tab:table) {} # prototype
                            
                            function void gzoGoDir(Dir:string) {
                                if(Dir == "") {
                                    gzoAddText("Go where?")
                                    return
                                }
                                
                                if(Game["Locs",table][Game["Location",string],table]["Paths",table]:exists(Dir:index(1))) {
                                    local Path = Game["Locs",table][Game["Location",string],table]["Paths",table][Dir:index(1),table]
                                    if(Path["Details",table]["State",string] == "unlocked" | Path["Details",table]["State",string] == "") {
                                        
                                        local NewLoc = Game["Locs",table][Game["Location",string],table]["Paths",table][Dir:index(1),table]
                                        
                                        if(NewLoc["TDesc",string] != "") {
                                            gzoMoveText(NewLoc["TDesc",string])
                                        }
                                        Game["Location",string] = NewLoc["ToLoc",string]
                                        gzoLook()
                                    }
                                    elseif(Path["Details",table]["State",string] == "locked") {
                                        gzoAddText("It's locked.")
                                    }
                                    elseif(Path["Details",table]["State",string]:sub(1,4) == "msg:") {
                                        gzoAddText(Path["Details",table]["State",string]:sub(5))
                                    }
                                    elseif(Path["Details",table]["State",string] == "action") {
                                        gzoPrivateCommand(Path["Details",table]["Action",table])
                                    }
                                    else {
                                        gzoAddText("You can't go that way.")
                                    }
                                }
                                else {
                                    gzoAddText("You can't go that way.")
                                }
                            }
                            
                            function void gzoOpenCont(Dat:string) {
                                if(Dat == "") {
                                    gzoAddText("Search what?")
                                    return
                                }
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                
                                foreach(K, T:table = Loc["Containers",table]) {
                                    if(K:lower():find(Dat)) {
                                        local Conts = T["Data",table]["Contents",table]
                                        if(Conts:count() == 0) {
                                            gzoAddText("It's empty.")
                                        }
                                        else {
                                            addText("  The " + K + " contains:", vec(200))
                                            foreach(K2, T2:table = Conts) {
                                                gzoAddText(K2 + " - " + T2[1,string])
                                                gzoAddItem(Game["Location",string], K2, "in the " + K + ".", T2[2,string], T2[3,string])
                                            }
                                        }
                                        
                                        return
                                    }
                                }
                                
                                gzoAddText("There is no such item in the area.")
                            }
                            
                            function void gzoPutOn(Name:string) {
                                foreach(K, T:table = Game["Inventory",table]) {
                                    if(K:lower():find(Name)) {
                                        if(T[3,string]:find("wearable")) {
                                            Game["Clothes",table][K,table] = T 
                                            Game["Inventory",table]:remove(K)
                                            gzoAddText("You put on the " + K + ".")
                                        }
                                        else {
                                            gzoAddText("You can't put that on!")
                                        }
                                        return
                                    }
                                }
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                foreach(K, T:table = Loc["Items",table]) {
                                    if(K:lower():find(Name)) {
                                        if(T[3,string]:find("wearable")) {
                                            gzoTake(Name)
                                            gzoPutOn(Name)
                                        }
                                        else {
                                            gzoAddText("You can't put that on!")
                                        }
                                        return
                                    }
                                }
                                
                                gzoAddText("There is no such item in your inventory or in the area.")
                            }
                            
                            function void gzoTakeOff(Name:string) {
                                foreach(K, T:table = Game["Clothes",table]) {
                                    if(K:lower():find(Name)) {
                                        if(!T[3,string]:find("immovable")) {
                                            Game["Inventory",table][K,table] = T 
                                            Game["Clothes",table]:remove(K)
                                            gzoAddText("You take off the " + K + ".")
                                        }
                                        else {
                                            gzoAddText("You can't take that off!")
                                        }
                                        return
                                    }
                                }
                                
                                gzoAddText("You are wearing no such item.")
                            }
                            
                            function void gzoExitThrough(Cmd:array) {
                                local Cmds = Cmd:clone()
                                Cmds:remove(1)
                                
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                
                                foreach(K, T:table = Loc["Paths",table]) {
                                    if(T["Name",string]:lower():find(Cmds:concat(" "))) {
                                        gzoGoDir(K)
                                        return
                                    }
                                }
                            }
                            
                            function void gzoPrivateCommand(Tab:table) {
                                local Cmd = Tab[1,string]:explode(" ")
                                switch(Cmd[1,string]) {
                                    case "die",
                                        gzoAddText(Tab[2,string])
                                        gzoDie()
                                    break
                                    
                                    case "unlock",
                                        local ULWhat = Cmd[2,string]:explode(":")
                                        local Loc = Game["Locs",table][Game["Location",string],table]
                                        if(ULWhat[1,string] == "path") {
                                            local Path = Loc["Paths",table][ULWhat[2,string],table]
                                            
                                            Path["Details",table]["State",string] = "unlocked"
                                            
                                        }
                                        else {
                                            
                                        }
                                    break
                                    
                                    case "move",
                                        gzoAddText(Tab[2,string])
                                        gzoGoDir(Cmd[2,string])
                                    break
                                    
                                    case "warp",
                                        gzoAddText(Tab[2,string])
                                        Game["Location",string] = Cmd[2,string]
                                        gzoLook()
                                    break
                                }
                                        
                            }
                            
                            function void gzoAction(Cmd:array) {
                                
                                
                                local Loc = Game["Locs",table][Game["Location",string],table]
                                local Action = 0
                                for(I = 1, Loc["Actions",table]:count()) {
                                    if(Loc["Actions",table][I,table][1,table][1,string] == Cmd[1,string]) {
                                        Action = I
                                        break
                                    }
                                }
                                
                                if(Action) {
                                    local ActionData = Loc["Actions",table][Action,table]
                                    local FullCmd = Cmd:concat(" "):replace(Cmd[1,string] + " ", "")
                                    local Condition = ActionData[1,table][2,string]
                                    switch(Cmd[1,string]) {
                                        case "throw",
                                            
                                            local Cond = Condition:explode("@")
                                            
                                            # if you have the item in your inventory
                                            local Found = 0
                                            foreach(K, T:table = Game["Inventory",table]) {
                                                if(K == Cond[1,string]) {
                                                    Found = 1
                                                    break
                                                }
                                            }
                                            
                                            if(!Found) {
                                                gzoAddText("You can't do that.")
                                                break
                                            }
                                            
                                            # did you do the command right
                                            local CmdParts = array()
                                            if(FullCmd:find(" at ")) {
                                                CmdParts = FullCmd:explode(" at ")
                                            }
                                            elseif(FullCmd:find(" through ")) {
                                                CmdParts = FullCmd:explode(" through ")
                                            }
                                            else {
                                                addText("  Use throw <item> at/through <object>",vec(255,200,200), 2)
                                                break
                                            }
                                            if(Cond[1,string]:lower():find(CmdParts[1,string]) & Cond[2,string]:lower():find(CmdParts[2,string])) {
                                                local ResultTab = ActionData[2,table]
                                                gzoAddText(ResultTab[2,string])
                                                Game["Inventory",table]:remove(Cond[1,string])
                                                
                                                gzoPrivateCommand(ResultTab)
                                            }
                                            else {
                                                gzoAddText("You can't do that.")
                                            }
                                            
                                        break
                                        
                                        case "push",
                                            if(Condition:lower():find(FullCmd)) {
                                                gzoPrivateCommand(ActionData[2,table])
                                            }
                                            else {
                                                gzoAddText("You can't do that.")
                                            }
                                            
                                        break
                                        
                                        case "jump",
                                            #Game["Locs",table][ID,table]["Actions",table]:pushTable(table(Condition,Response))
                                            #Cond = table("jump","north/n/gap/ledge")
                                            #Res = table(cnd, truetable(move, print), falsetable(warp, where, print) )
                                            
#gzoAddAction("ledge1",table("jump", "south/s/ledge/gap/platform"), table("cnd:wear=Running Shoes", 
#                                                          table("move:s", "Print me"), table("die", "Print me")))
                                            
                                            if(ActionData[1,table][2,string]:find(Cmd[2,string])) {
                                                local Res = ActionData[2,table]
                                                local GoForIt = 0
                                                if(Res[1,string]:find("cnd:")) {
                                                    
                                                    if(Res[1,string]:find("wear=")) {
                                                        if(Game["Clothes",table]:exists(Res[1,string]:explode("wear=")[2,string])) {
                                                            GoForIt = 1
                                                        }
                                                    }
                                                }
                                                
                                                if(GoForIt) {
                                                    #local Do = Res[2,table]
                                                    gzoPrivateCommand(Res[2,table])
                                                    
                                                }
                                                else {
                                                    #local Do = Res[3,table]
                                                    gzoPrivateCommand(Res[3,table])
                                                }
                                                    
                                            }
                                            else {
                                                gzoAddText("Jump where?")
                                            }
                                            
                                        break
                                        
                                        default,
                                            gzoAddText("You can't do that.")
                                        break
                                    }
                                }
                                        
                            }
                            
                            
                            function void gzoCommand(Cmd:string) {
                                if(Game["GameOver",number]) {
                                    local Found = 0
                                    switch(Cmd) {
                                        case "reset",
                                        case "restart",
                                        case "exit",
                                        case "quit",
                                            Found = 1
                                        break
                                    }
                                    
                                    if(!Found) {
                                        gzoAddText("You are dead! You can only quit and restart.")
                                    }
                                }
                                
                                Cmd = Cmd:lower()
                                switch(Game["CheckCmd",string]) {
                                    case "quit",
                                    case "exit",
                                        switch(Cmd) {
                                            case "y",
                                            case "yes",
                                                Game["Gameover",number] = -1
                                                timer("Close Game",100)
                                                
                                                addText("")
                                                addText(" MayOS v" + Version, vec(200))
                                            break
                                            
                                            case "n",
                                            case "no",
                                                Game["CheckCmd",string] = ""
                                                addText("")
                                            break
                                        }
                                    break
                                    
                                    case "restart",
                                    case "reset",
                                        switch(Cmd) {
                                            case "y",
                                            case "yes",
                                                resetGame()
                                                Game["CheckCmd",string] = ""
                                                addText("")
                                                addText("")
                                            break
                                            
                                            case "n",
                                            case "no",
                                                Game["CheckCmd",string] = ""
                                                addText("")
                                            break
                                        }
                                    break
                                    #[
                                    case "",
                                        switch(Cmd) {
                                            case "y",
                                            case "yes",
                                                
                                            break
                                            
                                            case "n",
                                            case "no",
                                                
                                            break
                                        }
                                    break
                                    ]#
                                    default,
                                        switch(Cmd) { # Begin actual entered commands.
                                            
                                            case "help",
                                                gzoAddText("Use 'help commands' for a command list.")
                                                gzoAddText("Use 'help general' for how to play.")
                                            break
                                            
                                            case "help commands",
                                                addText("  Commands:", vec(200))
                                                gzoAddText("north/south/east/west/up/down - Travel a direction")
                                                gzoAddText("look - Look around the area")
                                                gzoAddText("inventory - Look at what you have")
                                                gzoAddText("search <container> - Search something.")
                                                gzoAddText("take <item> - Pick up an item")
                                                gzoAddText("actions:")# push/pull/throw/jump")
                                                gzoAddText("  push/pull <object> - Try to move something.")
                                                gzoAddText("  throw <item> - Throw something in your inventory.")
                                                gzoAddText("  jump <where> - Jump in a direction.")
                                            break
                                            
                                            case "help general",
                                                gzoAddText("Welcome to Zork! You find yourself in your office, and hear a loud noise and some comotion outside of your door.")
                                                gzoAddText("You objective is to explore the world and figure out what is going on.")
                                                gzoAddText("You will explore in two ways:")
                                                gzoAddText("-Traveling between areas using directional commands")
                                                gzoAddText("-Searching areas")
                                                gzoAddText("There are a number of actions and commands you can do at any given time, such as take <item> or search <container>.")
                                                gzoAddText("Be careful, though. It is possible to die!")
                                                gzoAddText("")
                                                gzoAddText("Have fun, and don't get eaten by a Grue.")
                                                gzoAddText("   (Use 'look' to look around)")
                                                
                                            break
                                            
                                            case "reset",
                                            case "restart",
                                            case "exit",
                                            case "quit",
                                                gzoAddText("Are you sure?")
                                                Game["CheckCmd",string] = Cmd
                                            break
                                            
                                            case "n",
                                            case "north",
                                            case "s",
                                            case "south",
                                            case "e",
                                            case "east",
                                            case "w",
                                            case "west",
                                            case "u",
                                            case "up",
                                            case "d",
                                            case "down",
                                                gzoGoDir(Cmd)
                                            break
                                            
                                            case "look",
                                            case "look around",
                                                gzoLook()
                                            break
                                            
                                            case "inv",
                                            case "inventory",
                                                if(Game["Inventory",table]:count() == 0) {
                                                    gzoAddText("You have nothing in your inventory.")
                                                }
                                                else {
                                                    gzoAddText("In your inventory:")
                                                    foreach(K, T:table = Game["Inventory",table]) {
                                                        gzoAddText(" " + K)
                                                    }
                                                }
                                                
                                                if(Game["Clothes",table]:count() == 0) {
                                                    gzoAddText("You aren't wearing anything noteworthy.")
                                                }
                                                else {
                                                    gzoAddText("You are wearing:")
                                                    foreach(K, T:table = Game["Clothes",table]) {
                                                        gzoAddText(" " + K)
                                                    }
                                                }
                                            break 
                                            
                                            case "wear",
                                            case "wearing",
                                                gzoSayClothes() 
                                            break
                                            
                                            default,
                                                local Cmds = Cmd:explode(" ")
                                                switch(Cmds[1,string]) {
                                                    case "warp",
                                                        if(User == owner()) {
                                                            Game["Location",string] = Cmds[2,string]
                                                            gzoLook()
                                                        }
                                                        else {
                                                            addText("  Unknown Command, cheater",vec(255,200,200), 2)
                                                        }
                                                    break
                                                    case "go",
                                                        switch(Cmds[2,string]) {
                                                            case "n",
                                                            case "north",
                                                            case "s",
                                                            case "south",
                                                            case "e",
                                                            case "east",
                                                            case "w",
                                                            case "west",
                                                            case "u",
                                                            case "up",
                                                            case "d",
                                                            case "down",
                                                                gzoGoDir(Cmds[2,string])
                                                            break
                                                            
                                                            default,
                                                                addText("  Unknown Command",vec(255,200,200), 2)
                                                            break
                                                        }
                                                    break
                                                    
                                                    case "reset",
                                                    case "restart",
                                                        if(Cmds[2,string] == "y" | Cmds[2,string] == "yes") {
                                                            resetGame()
                                                            addText("")
                                                            addText("")
                                                        }
                                                    break
                                                    
                                                    case "exit",
                                                        gzoExitThrough(Cmds)
                                                    case "quit",
                                                        if(Cmds[2,string] == "y" | Cmds[2,string] == "yes") {
                                                            Game["Gameover",number] = -1
                                                            timer("Close Game",100)
                                                            
                                                            addText("")
                                                            addText(" MayOS v" + Version, vec(200))
                                                        }
                                                    break
                                                    
                                                    case "enter",
                                                        gzoExitThrough(Cmds)
                                                    break
                                                    
                                                    case "inspect",
                                                    case "look",
                                                        if(Cmds[2,string] == "at") {
                                                            Cmds:remove(2)
                                                        }
                                                        Cmds:remove(1)
                                                        gzoInspect(Cmds:concat(" "))
                                                    break
                                                    
                                                    case "open",
                                                    case "search",
                                                        Cmds:remove(1)
                                                        gzoOpenCont(Cmds:concat(" "))
                                                    break
                                                    
                                                    case "take",
                                                        if(Cmds[2,string] == "off") {
                                                            Cmds:remove(2)
                                                            Cmds:remove(1)
                                                            gzoTakeOff(Cmds:concat(" "))
                                                            break
                                                        }
                                                    case "pick",
                                                        if(Cmds[2,string] == "up") {
                                                            Cmds:remove(2)
                                                        }
                                                        Cmds:remove(1)
                                                        gzoTake(Cmds:concat(" "))
                                                    break
                                                    
                                                    case "put",
                                                    case "wear",
                                                        if(Cmds[2,string] == "on") {
                                                            Cmds:remove(2)
                                                        }
                                                        Cmds:remove(1)
                                                        gzoPutOn(Cmds:concat(" "))
                                                    break
                                                    
                                                    case "remove",
                                                        Cmds:remove(1)
                                                        gzoTakeOff(Cmds:concat(" "))
                                                    break
                                                    
                                                    case "push",
                                                    case "pull",
                                                    case "throw",
                                                    case "jump",
                                                        gzoAction(Cmds)
                                                    break
                                                    
                                                    default,
                                                        addText("  Unknown Command",vec(255,200,200), 2)
                                                    break
                                                }
                                            break
                                        }
                                    break
                                }
                            }
                            
                            
                            
                            #Item, Cont (container), Path, Deet
                            
                            #[ 
                            Location:
                                Cons: 
                                    ID
                                    Name
                                    Description
                                Loose Items
                                Containers
                                Paths
                            
                            Bugs:
                                Make it so when an item is picked up from a container, it removes it from the container.
                            
                            ]#
                            
                            Game["Location",string] = "office1"
                            Game["Inventory",table] = table()
                            gzoForcePickupItem("Running Shoes", table("","I'm fast as heck, boi!", "wearable"))
                            Game["Clothes",table] = table()
                            
                            # Office 1
                            gzoAddLoc("office1", "Office", "You are in your small office.")
                                gzoAddPath("office1", "hall1", "w", "Door", "A door leads to the west.", "", table("State" = "locked"))
                                gzoAddPath("office1", "ledge1", "e", "Window", "There is a cracked window to the east.", "You climb through the shattered window.",
                                    table("State" = "CAN'T BE OPENED", "FineDetail" = "It's a large but flimsy window with a crack along the edge. You put in a maintenance request weeks ago but they're a bunch of bums.") )
                                    gzoAddAction("office1",table("throw", "Heavy Lamp@Window"), table("unlock path:e", "You throw the lamp through the window."))
                                    gzoAddAction("office1",table("push", "Window"), table("die", "You push on the flimsy window. It shatters, and you fall through, plunging to your death."))
                                gzoAddItem("office1", "Heavy Lamp", "on your desk.", "It's a heavy lamp given to you by your boss. It has a plaque that reads \"For above average performance among mediocrity.\"", "")
                                gzoAddCont("office1", "Desk", "Your desk is in the center of the room", 
                                    table("Contents" = table(
                                        "Wedding Ring"=table("It contains your wedding ring from your marriage to your ex-wife.", "Your wedding ring from your marriage to your ex-wife. It brings you both good and bad memories.", "wearable")
                                    ))) 
                            
                            # Hallway 1
                            gzoAddLoc("hall1", "Hallway", "You are in a dark hallway.")
                                gzoAddPath("hall1", "office1", "e", "Door", "The door to your office is to the east.", "", table())
                            
                            # Ledge 1
                            gzoAddLoc("ledge1", "Narrow Ledge", "You are on a narrow ledge.")
                                gzoAddPath("ledge1", "office1", "w", "Window", "A shattered window leads to the west.", "You climb through the shattered window.",
                                    table("State" = "msg:You probably shouldn't go back in there right now."))
                                gzoAddPath("ledge1", "ledge2", "s", "Gap", "To the south, a one meter gap leads to another larger platform. The gap is too far to step across, you'll need to jump.", "",
                                    table("State" = "action", "Action" = table("die", "You attempt to step across the gap, but it is too far and you plunge do your death.")))
                                    gzoAddAction("ledge1",table("jump", "south/s/ledge/gap/platform"), table("cnd:wear=Running Shoes", table("warp ledge2", "You skillfully leap across the gap."), table("die", "You attempt to jump across the gap, but you are wearing worn dress shoes, and your foot slips and you plunge to your death.")))
                                gzoAddPath("ledge1", "fireescape1", "n", "Fire Escape", "There is a fire escape to the north.", "", table())
                            
                            #Ledge 2
                            gzoAddLoc("ledge2", "Platform", "You are on a broader platform.")
                                gzoAddPath("ledge2", "ledge1", "n", "Gap", "To the north, a one meter gap leads back to the narrow ledge. The gap is too far to step across, you'll need to jump.", "",
                                    table("State" = "action", "Action" = table("die", "You attempt to step across the gap, but it is too far and you plunge do your death.")))
                                    gzoAddAction("ledge2",table("jump","north/n/gap/ledge"),table("cnd:wear=Running Shoes", 
                                        table("warp ledge1", "You skillfully leap across the gap."), table("warp secret1", "You attempt to step across the gap, but it is too far and fall onto a lower platform.")))
                                        
                            # Fire Escape 1
                            gzoAddLoc("fireescape1", "Fire Escape", "You are high up on a fire escape.")
                                gzoAddPath("fireescape1", "roof1", "u", "Stairs", "There are stairs leading up to the roof.", "You carefully ascend the rickety staircase.", table())
                                gzoAddPath("fireescape1", "alley1", "d", "Stairs", "There are stairs leading down to the alley below.", "You carefully descend the rickety staircase.", table())
                                gzoAddPath("fireescape1", "ledge1", "s", "Ledge", "The ledge outside your office window is to the south.", "", table())
                            
                            # Roof 1
                            gzoAddLoc("roof1", "Roof", "You are on top of the roof of your building.")
                                gzoAddPath("roof1", "fireescape1", "e", "Stairs", "To the east there are stairs leading to the fire escape.","You carefully descend the rickety staircase.",table())
                                gzoAddPath("roof1", "roof2", "w", "Gap", "To the west, the neighboring building is 15 feet away from your building.", "You carefully shimmy along the rope.",
                                    table("State" = "Cant' be opened"))
                            
                            #Roof 2
                            gzoAddLoc("roof2", "Roof", "You are on top of the neighboring building.")
                            
                            #Alley 1
                            gzoAddLoc("alley1", "Alley", "You are in the alley behind your building.")
                                gzoAddPath("alley1","fireescape1","u", "Stairs", "Above you are stairs leading up to the fire escape.", "You carefully ascend the rickety staircase.", table())
                            
                            
                            
                            
                            # Secret Areas!
                            #Secret 1
                            gzoAddLoc("secret1", "Secret Area!", "You found a secret area!")
                                gzoAddPath("secret1", "ledge1", "u", "Ladder", "A hidden ladder leads up to the narrow ledge.","You climb the ladder back up to the ledge. You don't think you can climb back down.",
                                    table())
                                gzoAddCont("secret1", "Chest", "There is a chest here.",
                                    table("Contents" = table(
                                        "Heights Trophy" = table("It contains a trophy!", "A trophy for not being afraid of heights! (And maybe being a little stupid)", "")
                                    )))
                            
                            
                            # Must go last
                            gzoLook()
                            
                            
                            
                            EGP:egpSetText(Data["EGP Type I",number], TypeData:sub(1+HorizScroll, 37+HorizScroll))
                            EGP:egpPos(Data["EGP Cursor",number], Data["EGP Cursor Root",vector2])
                            updateConsole()
                            Game["Setup",number] = 0
                        break #end 1
                    }
                break #end zork
            }
        }
        
        return !Game["Setup",number]
    }
    
    function void doCommand(Command:string) {
        switch(Command:lower():trim()) {
            # put all single line commands here
            
            case "help",
                addText("    -- Public Commands --",vec(200,255,200))
                addText(" help <cmd>  ->  Get more info on a command.",vec(200))
                addText(" exit        ->  Exit the console.",vec(200))
                addText(" clear       ->  Clear the console screen.", vec(200))
                addText(" kick        ->  Get kicked from the console.",vec(200))
                addText(" log <num>   ->  Print a log entry.", vec(200))
                addText(" say <msg>   ->  Speak through ElMico!", vec(200))
                addText(" msg <ply> <msg>",vec(200))
                addText("             -> Send a private message.", vec(200))
                addText(" update      ->  Update the E2.", vec(200))
                addText(" about       ->  See info about MayOS.", vec(200))
                addText(" ")
                addText("    -- Games --",vec(200,200,255))
                addText(" 2048        ->  Play 2048!",vec(200))
                addText(" minesweeper ->  Play Minesweeper!", vec(200))
                addText(" tetris      ->  Play Tetris!", vec(200))
                addText(" tic tac toe ->  Play Tic-Tac-Toe!", vec(200))
                addText(" zork        ->  Play ElMico's take on Zork!", vec(200))
                addText(" ")
                addText("    -- Tips & Tricks --",vec(255,255,200)) 
                addText(" Use [tab] to autocomplete commands.", vec(200))
                addText(" Use arrow keys and mouse wheel to scroll.", vec(200))
                
            break
            
            case "test",
                
                
            break
            
            case "update",
                if(Update["UpdateAvail",number]) {
                    print("Updating. . .\nBe sure to save the new Expression 2!")
                    Update["IsUpdating",number] = 1
                    entity():remoteSetCode(Update["NewE2",string])
                }
                else {
                    timer("CheckUpdate",10)
                    addText("  Checking for update.",vec(200))
                    #addText(" No new updates available.", vec(255,200,200))
                }
            break
            
            case "about",
                addText(" ")
                addText(" ")
                addText("    MayOS v" + Version, vec(200,255,200))
                addText(" ")
                addText("  Created by:", vec(150))
                addText("    ElMico",vec(255))
                addText("  Last version release:",vec(150))
                addText("    " + Update["Updated",string], vec(255))
                addText(" ")
                addText(" For more info type 'about 1'",vec(200))
                
            break
            case "tetris",
            case "2048",
            case "tic tac toe",
            case "zork",
                Game = table()
                timer("Setup Game " + Command, 10)
                Disp["Mode",string] = "Setup Game"
            break
            
            case "exit",
                
                Disp["Mode",string] = "Login"
                setDisplay()
            break
            
            case "clear",
                Text["Text",table] = table()
                updateConsole()
            break
            
            case "kick",
                addText("- Later loser.", vec(200,200,255))
                Kick = 2
                LastUser = User
                timer("UnKick",50)
            break
            
            case "logs",
                writeLogs()
            break
            
            default,
                
                local Cmd = Command:explode(" ")
                
                switch(Cmd[1,string]) {
                    
                    case "help",
                        addText(" ")
                        addText(" ")
                        switch(Cmd[2,string]) {
                            case "help",
                                addText(" You're an idiot.", vec(255,200,200))
                                Kick = 2
                                LastUser = User
                                timer("UnKick",50)
                            break
                            
                            case "tic",
                                if(Cmd[3,string]+Cmd[4,string] == "tactoe") {
                                    addText(" Usage: tic tac toe", vec(200,255,200))
                                    addText(" Allows you to play Tic-Tac-Toe with another player on the server. The second player will need their own Screen, Keyboard, and MayOS v2 E2.", vec(200), 3)
                                    addText(" After running 'tic tac toe', you will have to wait for Player 2 to run the same command on their MayOS. After, you may begin the game.", vec(200), 3)
                                }
                            break
                            
                            case "exit",
                                addText(" Usage: exit", vec(200,255,200))
                                addText(" Returns to the login screen.", vec(200))
                            break
                            
                            case "about",
                                addText(" Usage: about", vec(200,255,200))
                                addText(" Usage: about <page>", vec(200,255,200))
                                addText(" Displays information about MayOS. Including a page will display a more detailed history.", vec(200), 3)
                            break
                            
                            case "clear",
                                addText(" Usage: clear", vec(200,255,200))
                                addText(" Removes all printed data from the console screen.", vec(200),3)
                            break
                            
                            case "kick",
                                addText(" Usage: kick", vec(200,255,200))
                                addText(" Disconnects you from the keyboard, and violently kicks you away from the screen.", vec(200), 3)
                            break
                            
                            case "log",
                                addText(" Usage: log <log index",vec(200,255,200))
                                addText(" Allows you to view saved logs of entered commands, and failed password attempts.", vec(200), 3)
                            break
                            
                            case "msg",
                                addText(" Usage: msg <player name> <message>",vec(200,255,200))
                                addText(" Sends <message> text to provided player.", vec(200), 3)
                                addText(" The <player name> cannot contain any spaces.", vec(200), 3)
                            break
                            
                            case "2048",
                                addText(" Usage: 2048", vec(200,255,200))
                                addText(" Use arrow keys to slide all game pieces in a direction.", vec(200))
                                addText(" Combine duplicate numbers into a single new piece.", vec(200))
                            break
                            
                            case "minesweeper",
                                addText(" Usage: minesweeper", vec(200,255,200))
                                addText(" Usage: minesweeper <mine count>", vec(200,255,200))
                                addText(" If no mine count is given, default is 10.", vec(200))
                                addText("   Must be between 1 and 100.", vec(200))
                                addText(" Suggested levels:", vec(200))
                                addText("   Easy:    10", vec(200))
                                addText("   Medium:  17", vec(200))
                                addText("   Hard:    25", vec(200))
                            break
                            
                            case "tetris",
                                addText(" Usage: tetris",vec(200,255,200))
                                addText(" Play tetris on a 10x20 board. Game is still under construction, so many parts may look unfinished and there are bugs.", vec(200), 3)
                            break
                            
                            case "zork",
                                addText(" Usage: zork", vec(200,255,200))
                                addText(" Play Zork, an entirely text-based adventure game. Don't get eaten by a Grue." ,vec(200), 3)
                            break
                            
                            case "update",
                                addText(" Usage: update", vec(200,255,200))
                                addText(" If there is an update available, you will be notified upon each login and the current version number in the upper corner will turn red.", vec(200),3)
                                addText(" When you have been notified, the update has already been downloaded. Upon entering the update command, the update will be immediately applied.",vec(200),3)
                                addText(" After updating, do not forget to right click on the E2 and save the new code.", vec(200), 3)
                            break
                            
                            default,
                                addText(" Error: no such command: " + Cmd[2,string], vec(255,200,200))
                            break
                        }
                    break
                    
                    case "test",
                        if(User != owner()) { break }
                        local Str = ""
                        
                        for(I = Cmd[2,string]:toNumber(), Cmd[3,string]:toNumber()) {
                            Str = Str + I + ":" + toChar(I) +" "
                        }
                        addText(Str)
                        updateConsole()
                    break
                    
                    case "log",
                    case "logs",
                        writeLog(Cmd[2,string]:toNumber())
                    break
                    
                    case "print",
                        if(Cmd[2,string]:sub(1,3) == "log") {
                            print(getLog(Cmd[3,string]:toNumber()))
                        }
                    break
                    
                    case "say",
                        concmd("say /y MayOS: " + Command:sub(5))
                    break
                    
                    case "pm",
                    case "msg",
                    case "message",
                        local Ply = findPlayerByName(Cmd[2,string])
                        if(Ply:isPlayer()) {
                            Ply:sendMessage("From " + User:name() + " using MayOS:")
                            Ply:sendMessage( Command:replace(Cmd[1,string]+" "+Cmd[2,string]+" ",""))
                        }
                        else {
                            addText("- Couldn't find player: " + Cmd[2,string], vec(255,180,180),2)
                        }
                    break
                    
                    case "minesweeper",
                    case "minesweeper2",
                        Game = table()
                        timer("Setup Game " + Command, 10)
                        Disp["Mode",string] = "Setup Game"
                    break
                        
                    
                    case "about",
                        switch(Cmd[2,string]) {
                            case "1",
                                addText("   About: 1/1", vec(150))
                                addText(" MayOS was originally created as an administrative computer for the Mayor in DarkRP--the name being a combination of Mayor and OS. "+
                                    "However, since v2.0, the focus has shifted more to creating a fun terminal-like experince. "+
                                    "This change came about after the addition of minesweeper and solitaire in the first version. "+
                                    "At that point I was beginning to add a lot more to the system than I had originally intended, and the code became very complicated. "+
                                    "Adding new features had turned into an extensive project, and so I decided to create a new \"framework\" for adding features. "+
                                    "Although the second version isn't really designed to be easily modified by you, I may create a future version that is more of a template for your own \"MayOS\".",vec(255),1)
                            break
                        }
                    break
                                                                
                    
                    default,
                        addText(" Error: no such command.", vec(255,200,200))
                    break
                }
            
            break
        }
    }
    
    function void keyboardTyped(NK, IsHeld) {
        if(NK > 31 & NK < 127) { # normal characters, 32 is space
            TypeData = TypeData:sub(1, TypePos) + toChar(NK) + TypeData:sub(TypePos+1,TypeData:length())
            TypePos++
            
            if((Disp["Mode",string] == "Console" | Game["ShowCons",number]) & TypePos-HorizScroll > 37) {#TypeData:length() > 37) {
                HorizScroll++
            }
        }
        else {
            switch(NK) {
                case  10, #Enter
                    if(Disp["Mode",string] == "Login") {
                        if(TypeData == Password | TypeData == GuestPW | TypeData == "") {
                            Data["Admin",number] = TypeData == Password
                            
                            Disp["Mode",string] = "Logged in"
                            setDisplay()
                        }
                        else {
                            logData("pw",TypeData)
                        }
                    }
                    elseif(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                        if(TypeData == "" ){
                            Kick = 1
                            LastUser = User
                            timer("UnKick",30)
                        }
                        else {
                            if(Game["Name",string] == "zork") {
                                addText("")
                            }
                            addText(TypeData, vec(255), 3)
                            if(Disp["Mode",string] == "Console") {
                                logData("cmd",TypeData)
                                doCommand(TypeData)    
                            }
                            elseif(Game["ShowCons",number]) {
                                switch(Game["Name",string]) {
                                    case "zork",
                                        gzoCommand(TypeData)
                                    break
                                }
                            }
                            updateConsole()
                            
                            
                        }
                    }
                    elseif(Disp["Mode",string] == "Game") {
                        if(Game["Name",string] == "tic tac toe") {
                            if(TypeData == "cheat") {
                                User:sendMessage("Go anywhere you'd like.")
                                Game["Cheat",number] = 1
                            }
                        }
                        elseif(Game["Name",string] == "minesweeper") {
                            if(TypeData == "xyzzy") {
                                User:sendMessage("Cheat enabled.")
                                Game["Cheat",number] = 1
                            }
                        }
                    }
                    TypePos = 0
                    HorizScroll = 0
                    TypeData = ""
                break
                case  127, # backspace
                    if(TypePos > 0) {
                        TypeData = TypeData:sub(1,TypePos-1) + TypeData:sub(TypePos+1,TypeData:length())
                        TypePos--
                        if(HorizScroll > 0) {
                            HorizScroll--
                        }
                    }
                break
                case  148, # delete
                    TypeData = TypeData:sub(1,TypePos) + TypeData:sub(TypePos+2, TypeData:length())
                    if(HorizScroll > 0 & TypePos-HorizScroll < 37) {
                        HorizScroll--
                    }
                break
                case  19, # left
                    if(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                        if(TypePos > 0) {
                            TypePos--
                            if(TypePos-HorizScroll < 0) {
                                HorizScroll--
                            }
                        }
                    }
                    elseif(Disp["Mode",string] == "Game") {
                        switch(Game["Name",string]) {
                            case "tetris",
                                if(!Game["GameOver",number]) {
                                    shiftMoving(-1)
                                    gtetDrawBoard()
                                }
                            break
                            
                            case "2048",
                                if(Game["CanShift",number]) {
                                    if(shiftTiles(4)) {
                                        Game["CanShift",number] = 0
                                        timer("SpawnTile",Game["SpawnLag",number])
                                        showTiles()
                                    }
                                }
                            break
                        }
                    }
                    else {
                        
                    }
                break
                case  20, #right
                    if(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                        if(TypePos < TypeData:length()) {
                            TypePos++
                            if(TypePos-HorizScroll > 37) {
                                HorizScroll++
                            }
                        }
                    }
                    elseif(Disp["Mode",string] == "Game") {
                        switch(Game["Name",string]) {
                            case "tetris",
                                if(!Game["GameOver",number]) {
                                    shiftMoving(1)
                                    gtetDrawBoard()
                                }
                            break
                            
                            case "2048",
                                if(Game["CanShift",number]) {
                                    if(shiftTiles(2)) {
                                        Game["CanShift",number] = 0
                                        timer("SpawnTile",Game["SpawnLag",number])
                                        showTiles()
                                    }
                                }
                            break
                        }
                    }
                    else {
                        
                    }
                break 
                case  17, #up
                    if(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                        if(Scroll < Text["Text",table]:count()-19) {
                            Scroll++
                            updateConsole()
                        }
                    }
                    elseif(Disp["Mode",string] == "Game") {
                        switch(Game["Name",string]) {
                            case "2048",
                                if(Game["CanShift",number]) {
                                    if(shiftTiles(1)) {
                                        Game["CanShift",number] = 0
                                        timer("SpawnTile",Game["SpawnLag",number])
                                        showTiles()
                                    }
                                }
                            break
                            
                            case "tetris",
                                if(!Game["GameOver",number]) {
                                    rotateMoving()
                                    gtetDrawBoard()
                                }
                            break
                        }
                        
                    }
                break
                case  18, #down
                    if(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                        if(Scroll > 0) {
                            Scroll--
                            updateConsole()
                        }
                    }
                    elseif(Disp["Mode",string] == "Game") {
                        switch(Game["Name",string]) {
                            case "2048",
                                if(Game["CanShift",number]) {
                                    if(shiftTiles(3)) {
                                        Game["CanShift",number] = 0
                                        timer("SpawnTile",Game["SpawnLag",number])
                                        showTiles()
                                    }
                                }
                            break
                            
                            case "tetris",                            
                                if(!Game["GameOver",number]) {
                                    stoptimer("Tetris")
                                    timer("Tetris",1)
                                }
                            break
                        }
                        
                    }
                break
                case  149, #home
                    TypePos = 0
                    HorizScroll = 0
                break
                case  150, #end
                    TypePos = TypeData:length()
                    if(TypeData:length() > 37) {
                        HorizScroll = TypeData:length()-37
                    }
                break
                case  9, #tab
                    #addText("1/24/2019 0:36:42 - ElMico attempted password: crap",vec(255),2)
                    
                    if(Disp["Mode",string] == "Console") {# & !TypeData:find(" ")) {
                        local Expl = TypeData:explode(" ")
                        local Str = Expl:removeString(Expl:count())
                        for(I = 1, Data["Commands",array]:count()) {
                            if(Data["Commands",array][I,string]:sub(1,Str:length()) == Str) {
                                
                                TypeData = Expl:concat(" ") + (Expl:count() == 0 ? "" : " ") + Data["Commands",array][I,string]
                                TypePos = TypeData:length()
                                updateConsole()
                                break
                            }
                        }
                    }
                break
                default, 
                    print(_HUD_PRINTCONSOLE, "Pressed: " + NK)
                break
            }
        }
    }
    
    function void finalGameSetup(Player) {
        
        Game["GameOver",number] = 0
        Game["Player",number] = Player
        
        switch(Game["Name",string]) {
            case "tic tac toe",
                EGP:egpSetText(Game["EGP YT I",number], "Your Turn")
                EGP:egpColor(Game["EGP YT I",number], vec((Game["Player",number] == Game["Turn",number])*205+50))
            break
        }
        
    }
    
    function void pause(Pause) {
        Game["Paused",number] = Pause
        
        switch(Game["Name",string]) {
            case "tetris",
                EGP:egpAlpha(Game["EGP Pause I",number], 255*Pause)
            break
        }
    }
    
    #############################################################################
    #### Post-Function Initializations ##########################################
    #############################################################################
    
    runOnKeys(owner(),1)
    runOnChat(1)
    runOnLast(1)
    runOnFile(1)
    runOnHTTP(1)
    
    dsJoinGroup("MayOS v2")
    
    #### Settings ###############################################################
    
    local R = array()
    
    Text = table()
        Text["Text",table] = table()
    Data = table()
        Data["MinSoundI",number] = 500
        Data["EGP Group Names",array]
        Data["EGP Groups",table] = table()
        Data["EGP Alphas",array] = array()
        #Data["EGP Show Cursor",number] = 1
        Data["Commands",array] = "help exit clear kick log say msg update about minesweeper tetris 2048":explode(" ")
        Data["Commands",array]:pushString("tic tac toe")
    Disp = table()
    Game = table()
    
    #### Load EGP ############################################################
    
    Data["EGP Mod",string] = "models/cheeze/pcb/pcb4.mdl"
    
    findClipToPlayerProps(owner())
    findByModel( Data["EGP Mod",string] )
    findSortByDistance(entity():pos())
    R = findToArray()
    Scr = noentity()
    for(I = 1, R:count()) {
        if(R[I,entity]:type() == "gmod_wire_egp" & R[I,entity]:owner() == owner()) {
            Scr = R[I,entity]
            break
        }
    }
    
    if(Scr == noentity()) {
        hint("Please spawn an EGP screen.",2)
    }
    else {
        entity():createWire(Scr, "EGP", "wirelink")
    }
    
    #### Load Keyboard #########################################################
    
    findByModel("models/beer/wiremod/keyboard.mdl")
    findSortByDistance(entity():pos())
    R = findToArray()
    Keyboard = noentity()
    for(I = 1, R:count()) {
        if(R[I,entity]:type() == "gmod_wire_keyboard" & R[I,entity]:owner() == owner()) {
            Keyboard = R[I,entity]
            break
        }
    }
    
    if(Keyboard == noentity()) {
        hint("Please spawn an keyboard.",2)
    }
    else {
        entity():createWire(Keyboard, "KeysIn", "wirelink")
        entity():createWire(Keyboard, "KeyHit", "Memory")
        entity():createWire(Keyboard, "KeysInUse", "InUse")
        entity():createWire(Keyboard, "User", "User")
        Keyboard:createWire(entity(), "Kick", "Kick")
        
        if(Scr != noentity()) {
            Keyboard:setPos(Scr:toWorld(vec(18,0,12)))
            Keyboard:setAng(Scr:toWorld(ang(-90,0,0)))
        }
        
        if(User:isPlayer()) {
            runOnKeys(User,1)
        }
    }
    
    #### Final Init ##############################################################
    
    resetEGP()
    timer("Clock",100)
    
    Disp["Mode",string] = "Login"
    setDisplay()
    
    
    # make the next line ##[ to load directly to a game
    ##[
    local GameToLoad = "zork"
    Disp["Mode",string] = "Logged in"
    setDisplay()
    timer("Setup Game " + GameToLoad, 100)
    Disp["Mode",string] = "Setup Game"
    #]#
    
    for(I = 0, 9) {
        holoCreate(Data["MinSoundI",number]+I, Scr:pos()+Scr:up()*20, vec())
            holoParent(Data["MinSoundI",number]+I, Scr)
    }
    
    # Auto suggest you check for a new update!
    #[if(daysSince(Update["Updated",string]) > 7) {
        Update["ShouldUpdate",number] = 1
    }]#
    
    #timer("CheckUpdate",10)
}
####################################################################################
#
#                      Timers
#
####################################################################################
elseif(clk(clkName())) {
    
    switch(clkName()) {
        case "Clock",
            timer("Clock",100)
            
            EGP:egpAngle(Data["EGP Mayo",number], abs( (curtime())  %2 - 1)*45-22.5)
            
            if(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                Data["Cursor Clock",number] = Data["Cursor Clock",number] + 1
                if(int(Data["Cursor Clock",number]/5)%2 ==1) {
                    EGP:egpAlpha(Data["EGP Cursor",number],0)
                }
                else {
                    EGP:egpAlpha(Data["EGP Cursor",number],255)
                }
            }
            
            if(Disp["Mode",string] == "Game") {
                if(Game["Name",string] == "minesweeper") {
                    EGP:egpAngle(Game["GearI",number], -curtime()*5)
                    EGP:egpAngle(Game["GearI",number]+1, curtime()*5*2-10)
                    
                    if(Game["Cheat",number]) {
                        local APos = EGP:egpCursor(User)
                        local Pos = APos-vec2(69,100)
                        Pos = round(Pos/(375/9))
                        local NPos = Pos:x() + Pos:y()*10
                        local ThisP = Game["Tiles",array][NPos + 1, number]
                        EGP:egpAlpha(Game["EGP Cheat I",number], int(ThisP) == -1 ? 255 : 0)
                    }
                }
            }
            
        break case "MoveOtherCrap",
            
            Keyboard:setPos(Scr:toWorld(vec(18,0,12)))
            Keyboard:setAng(Scr:toWorld(ang(-90,0,0)))
            
            entity():setPos(Scr:toWorld(vec(12,20,0)))
            entity():setAng(Scr:angles())
        
        break case "CheckUpdate",
            
            if(httpCanRequest()) {
                httpRequest(Update["URL",string])
            }
            else {
                timer("CheckUpdate",1000)
            }
        
        break case "GetUpdate",
            
            if(httpCanRequest()) {
                httpRequest(Update["NewURL",string])
            }
            else {
                timer("GetUpdate",1000)
            }
            
        break case "UnKick",
            if(Kick == 2) {
                LastUser:plyApplyForce( (LastUser:pos()-Scr:pos()):setZ(0):normalized():setZ(2)*130)
                
                playSound("physics/body/body_medium_impact_hard"+ (2+randint(1,2)*2) +".wav", 500)
            }
            Kick = 0
        
        break case "ShiftTiles",
            
            EGP:egpPos(Game["EGP Board I",number], Game["Cent",vector2])
        
        break case "SpawnTile",
        
            Game["CanShift",number] = 1
            addTile()
            if(!g2048AnyOpenings()) {
                if(g2048CheckGameOver()) {
                    Game["CanShift",number] = 0
                    Game["GameOver",number] = 1
                    User:sendMessage("Game over!")
                }
            }
            showTiles()
        break case "Test",
            
            while(perf(MP) & Data["T1",number] < 256) {
                Data["T2",string] = ""+Data["T1",number]+Data["T2",string]+toChar(Data["T1",number])+" "
                Data["T1",number] = Data["T1",number]+1
            }
            
            if(Data["T1",number] >= 512) {
                addText(Data["T2",string])
                updateConsole()
            }
            else{
                timer("Test",100)
            }
        
        
            
        break case "Close Game",
            Disp["Mode",string] = "Console"
            showArrow(0)
            setDisplay()
            EGP:egpSetText(Data["EGP Type I",number], TypeData:sub(1+HorizScroll, 37+HorizScroll))
            EGP:egpPos(Data["EGP Cursor",number], Data["EGP Cursor Root",vector2] + vec2((TypePos-HorizScroll)*13, 0))
            updateConsole()
            Game = table()
        
        break case "Tetris",
            timer("Tetris",Game["GameSpeed",number])
            
            if(!Game["Paused",number]) {
            
                if(Game["AddBlock",number]) {
                    Game["AddBlock",number] = 0
                    if(!gtetAddBlock(randint(1,7))) {
                        User:sendMessage("game over")
                        stoptimer("Tetris")
                        Game["GameOver",number] = 1
                    }
                }
                else {
                    local Hit = 0
                    for(I = 1,Game["Moving",table]:count()) {
                        local ThisM = Game["Moving",table][I,array][1,vector2]
                        #Game["Rows",table][floor(I/Game["Width",number])+1,array][I%Game["Width",number]+1,number]
                        if(ThisM:y() == Game["Height",number] | Game["Rows",table][ThisM:y()+1,array][ThisM:x(),number] != 0) {
                            Hit = 1
                            break
                        }
                    }
                    
                    if(!Hit) {
                        lowerMoving()
                    }
                    else {
                        commitMoving()
                        Game["AddBlock",number] = 1
                    }
                }
                
                gtetDrawBoard()
            }
            
        break case "KeyHold",
            
            
            if(Disp["Mode",string] == "Console") {
                if(HeldKey > 31 & HeldKey < 127) {
                    if(User:keyPressed(toChar(HeldKey))) {
                        timer("KeyRepeat",10)
                        KeyToCheck = toChar(HeldKey)
                    }
                }
                else {
                    if(HeldKey == 127) { # backspace
                        if(User:keyPressed("backspace")) {
                            timer("KeyRepeat",10)
                            KeyToCheck = "backspace"
                        }
                    }
                }
            }
        
        break case "KeyRepeat",
            
            if(User:keyPressed(KeyToCheck)) {
                timer("KeyRepeat",100)
                keyboardTyped(HeldKey,1)
                
                Data["Cursor Clock",number] = 0
                EGP:egpSetText(Data["EGP Type I",number], TypeData:sub(1+HorizScroll, 37+HorizScroll))
                EGP:egpPos(Data["EGP Cursor",number], Data["EGP Cursor Root",vector2] + vec2((TypePos-HorizScroll)*13, 0))
                
            }
            
        break case "UnloadKeyboard",
            
            while(KeysIn[1] != 0 & perf(MP)) { # every time the keyboard says it has key(s) in memory, loop and grab each key
            
                local NK = KeysIn[1] # grab the first key, and then clear first key (at the end)
                
                keyboardTyped(NK, 0)
                if(KeysIn[2] == 0) {
                    stoptimer("KeyHold")
                    stoptimer("KeyRepeat")
                    
                    timer("KeyHold",750)
                    HeldKey = NK
                }
                
                KeysIn[0] = 1 # deletes first key from memory of keyboard
            }
            
            if(KeysIn[1] == 0) {
            
                if(Disp["Mode",string] == "Login") {
                    
                    for(I = 0, Data["EGP Password Chars",number]) {
                        if(I+1 <= TypeData:length()) {
                            EGP:egpAlpha(I+Data["EGP Password I",number],255)
                        }
                        else {
                            EGP:egpAlpha(I+Data["EGP Password I",number],0)
                        }
                    }
                }
                elseif(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
                    # Console
                    Data["Cursor Clock",number] = 0
                    EGP:egpSetText(Data["EGP Type I",number], TypeData:sub(1+HorizScroll, 37+HorizScroll))
                    EGP:egpPos(Data["EGP Cursor",number], Data["EGP Cursor Root",vector2] + vec2((TypePos-HorizScroll)*13, 0))#vec2(30+TypePos*16, 512-22))
                }
                
            }
            else {
                timer("UnloadKeyboard",50)
            }
        
        break case "SendUID",
        
            dsSend("UID", "MayOS v2", ""+UID)
        
        break case "DoStack",
            local RI = Game["Root Tile",number]
            while(Game["Stack",table]:count() & perf(MP)) {
                local P = Game["Stack",table]:popVector2()
                
                #inrange(P,vec2(0,0),vec2(9,9))
                if(!Game["Checked",table][""+P:x()+","+P:y(),number] & (P:x() >-1 & P:x() < 10 & P:y() >-1 & P:y() < 10) & 
                        Game["Tiles",array][P:x() + P:y()*10 + 1, number] == 0) {
                    
                    local C = gmsCountMines(P:x(),P:y())
                    Game["Tiles",array][P:x()+P:y()*10+1, number] = 1
                    if(C == 0) {
                        EGP:egpMaterial(RI + P:x()+P:y()*10, "gui/gradient_up")
                        EGP:egpColor(RI+100+P:x()+P:y()*10,vec(200))
                        Game["Cleared",number] = Game["Cleared",number] + 1
                        
                        for(Y = -(P:y() > 0), P:y() < 9) {
                            for(X = -(P:x() > 0) , P:x() < 9) {
                                if(X==0&Y==0) { continue }
                                if(!Game["Checked",table][""+   (P:x()+X)   +","+   (P:y()+Y)   ,number]) {
                                    Game["Stack",table]:pushVector2(P+vec2(X,Y))
                                }
                            }
                        }
                    }
                    else {
                        EGP:egpMaterial(RI + P:x()+P:y()*10, "gui/gradient_up")
                        EGP:egpSetText(RI+200 + P:x() + P:y()*10, ""+C)
                        EGP:egpColor(RI+100+P:x()+P:y()*10, vec(200))
                        EGP:egpColor(RI+200 + P:x() + P:y()*10, gmsMineNumCol(C))
                        Game["Cleared",number] = Game["Cleared",number] + 1
                    }
                }
                Game["Checked",table][""+P:x()+","+P:y(),number] = 1
            }
            
            if(Game["Stack",table]:count() == 0) {
                Game["DoStack",number] = 0
            }
            else {
                timer("DoStack",100)
            }
            
        break
        
        default,
            local Clk = clkName():explode(" ")
            switch(Clk[1,string]) {
                
                case "StopSound",
                    local N = Clk[2,string]:toNumber()
                    soundStop(N)
                break
                
                case "Setup",
                    
                    if(Clk[2,string] == "Game") {
                        if(setupGame(clkName())) {
                            showArrow(1)
                            Disp["Mode",string] = "Game"
                        }
                        else {
                            timer(clkName(), 100)
                        }
                    }
                break
                
                case "LoadFile",
                    if(fileCanLoad()) {
                        local Str = clkName():explode(" ")
                        Str:removeString(1)
                        fileLoad(Str:concat(" "))
                        hint("Loading " + Str:concat(" "), 7)
                    }
                    else {
                        timer(clkName(),1000)
                    }
                break
            }
        break
    }
}
####################################################################################
#
#                      Inputs
#
####################################################################################
elseif(inputClk()) { # if updated by an input
    if(KeyHit & ~KeyHit) {
        stoptimer("UnloadKeyboard")
        timer("UnloadKeyboard",10)
    }
    elseif(~KeysInUse) {
        if(KeysInUse) {
            sendPlyName(User:name())
            if(Disp["Mode",string] == "Game") {
                #Game["Paused",number] = 0
                pause(0)
            }
            
            LastWep = User:weapon():type()
            
            User:plySelectWeapon("keys")
            runOnKeys(User,1)
            LastUser = User
            
        }
        else {
            sendPlyName("null")
            if(Disp["Mode",string] == "Game") {
                #Game["Paused",number] = 1
                pause(1)
            }
            
            if(LastUser != owner()) {
                runOnKeys(LastUser,0)
            }
            
            if(LastWep != "") {
                LastUser:plySelectWeapon(LastWep)
            }
            LastWep = ""
        }
    }
}
####################################################################################
#
#               Keystrokes (mostly non-wire keyboard)
#
####################################################################################
elseif(keyClk(keyClk()) == 1) { #if updated by a key pressed
    if(keyClk() == User) {

        if(Disp["Mode",string] == "Console" | Game["ShowCons",number]) {
            if(keyClkPressed() == "mouse_wheel_up") {
                if(Scroll < Text["Text",table]:count()-19) {
                    Scroll++
                    updateConsole()
                }
            }
            elseif(keyClkPressed() == "mouse_wheel_down") {
                if(Scroll > 0) {
                    Scroll--
                    updateConsole()
                }
            }
        }
        elseif(Disp["Mode",string] == "Game") {
            local HitButton = 0
            if(keyClkPressed() == "mouse_left") {
                local APos = EGP:egpCursor(keyClk())
                
                if(APos:distance(EGP:egpPos(Game["Exit I",number])) < 20) { # quit
                    #hint("quit",5)
                    Game["Gameover",number] = -1
                    timer("Close Game",100)
                    sendQuit()
                    HitButton = 1
                }
                elseif(APos:distance(EGP:egpPos(Game["Reset I",number])) < 20) { # reset
                    resetGame()
                    sendReset()
                    HitButton = 1
                }
            }
            
            if(!HitButton) {
            
                switch(Game["Name",string]) {
                    
                    case "minesweeper",
                        if(keyClkPressed() == "d") {
                            #print(EGP:egpCursor(keyClk()))
                            local APos = EGP:egpCursor(keyClk())
                            local Pos = APos-vec2(69,100)
                            Pos = round(Pos/(375/9))
                            local NPos = Pos:x() + Pos:y()*10
                            local ThisP = Game["Tiles",array][NPos + 1, number]
                            if(ThisP != -1) {
                                #print(Pos)
                            }
                        }
                        
                        if(!Game["DoStack",number]) {
                            if(!Game["Gameover",number]) {
                                if(keyClkPressed() == "mouse_left") {
                                    local APos = EGP:egpCursor(keyClk())
                                    local Pos = APos-vec2(69,100)
                                    Pos = round(Pos/(375/9))
                                    local NPos = Pos:x() + Pos:y()*10
                                    local RI = Game["Root Tile",number]
                                    
                                    if(Game["MinesPoss",array]:count() == 0) {
                                        gmsPlaceMines(Pos:x(),Pos:y())
                                    }
                                    
                                    #if you hit the board and you aren't clicking a flag
                                    if(inrange(Pos,vec2(),vec2(9)) & int(Game["Tiles",array][NPos + 1, number]) == Game["Tiles",array][NPos + 1, number] & EGP:egpMaterial(RI + NPos)!= "gui/gradient_up") {
                                        EGP:egpMaterial(RI + NPos, "gui/gradient_up") # "reveal"
                                        EGP:egpColor(RI+100 + NPos, vec(200))
                                        Game["Cleared",number] = Game["Cleared",number] + 1
                                        if(Game["Tiles",array][NPos + 1, number] == -1) {
                                            EGP:egpAlpha(RI+300+NPos,255)
                                            EGP:egpColor(RI+NPos,vec(255,100,100))
                                            Game["Gameover",number] = 1
                                        }
                                        elseif(Game["Tiles",array][NPos + 1, number] != 1) {
                                            
                                            Game["Tiles",array][NPos+1,number] = 1
                                            
                                            
                                            local Count = gmsCountMines(Pos:x(),Pos:y())
                                            if(Count != 0) {
                                                EGP:egpSetText(RI+200+NPos, ""+Count)
                                                EGP:egpColor(RI+200+NPos, gmsMineNumCol(Count))
                                            }
                                            else {
                                                EGP:egpColor(RI+100+NPos, vec(200))
                                                
                                                Game["Checked",table] = table()
                                                Game["Checked",table][""+Pos:x()+","+Pos:y(),number] = 1
                                                
                                                Game["Stack",table]:pushVector2(Pos-vec2(1,0))
                                                Game["Stack",table]:pushVector2(Pos-vec2(0,1))
                                                Game["Stack",table]:pushVector2(Pos+vec2(1,0))
                                                Game["Stack",table]:pushVector2(Pos+vec2(0,1))
                                                
                                                Game["DoStack",number] = 1
                                                timer("DoStack",10)
                                            }
                                        }
                                    }
                                    
                                }
                            
                                elseif(keyClkPressed() == "mouse_right") {  #gui/legs1
                                    if(!Game["Gameover",number]) {
                                        local APos = EGP:egpCursor(keyClk())
                                        local Pos = APos-vec2(69,100)
                                        Pos = round(Pos/(375/9))
                                        local NPos = Pos:x() + Pos:y()*10
                                        local RI = Game["Root Tile",number]
                                        
                                        if(inrange(Pos,vec2(),vec2(9))) {
                                            if(int(Game["Tiles",array][NPos+1,number]) != 1) {
                                                if(int(Game["Tiles",array][NPos+1,number]) == Game["Tiles",array][NPos+1,number]) { # flag was off
                                                    if(Game["Tiles",array][NPos+1,number] < 0) {
                                                        Game["Tiles",array][NPos+1,number] = Game["Tiles",array][NPos+1,number] - 0.1
                                                    } else {
                                                        Game["Tiles",array][NPos+1,number] = Game["Tiles",array][NPos+1,number] + 0.1
                                                        #print(Game["Tiles",array][NPos,number])
                                                    }
                                                    
                                                    
                                                    Game["Flags",number] = Game["Flags",number] + 1
                                                    EGP:egpAlpha(RI+400+NPos,255)
                                                }
                                                else { # flag was on
                                                    Game["Flags",number] = Game["Flags",number] - 1
                                                    Game["Tiles",array][NPos+1,number] = int(Game["Tiles",array][NPos+1,number])
                                                    EGP:egpAlpha(RI+400+NPos,0)
                                                }
                                            }
                                        }
                                        
                                        EGP:egpSetText(Game["FlagTextI",number], ":" + (Game["Flags",number] < 10 ? "0" : "") + Game["Flags",number])
                                    }
                                }
                                
                                if(!Game["Gameover",number] & (keyClkPressed() == "mouse_right" | keyClkPressed() == "mouse_left")) {
                                    #[local FlaggedMines = 0
                                    for(I = 1, Game["MinesPoss",array]:count()) {
                                        local M = Game["MinesPoss",array][I,vector2]
                                        if(Game["Tiles",array][M:x() + M:y()*10+1,number] == -1.1) {
                                            FlaggedMines++
                                        }
                                    }]#
                                    #FlaggedMines == Game["Flags",number] & FlaggedMines == Game["Mines",number] & 
                                    if(Game["Cleared",number] + Game["Mines",number] == 10*10) {
                                        Game["Gameover",number] = 2
                                        
                                        User:sendMessage("you win!")
                                    }
                                }
                            }
                        }
                        
                    break
                    
                    case "tetris",
                        
                        
                    break
                    
                    case "tic tac toe",
                        #Game["EGP Box I",number]
                        if(keyClkPressed() == "mouse_left") {
                            local APos = EGP:egpCursor(keyClk())
                            
                            
                            if(!Game["GameOver",number] & Game["Turn",number] == Game["Player",number]) {
                                local ShortDist = 100000
                                local Hit = -1
                                for(I = 1, 9) {
                                    local Dist = APos:distance(EGP:egpPos(Game["EGP Box I",number]+I-1)) 
                                    if(Dist < ShortDist) {
                                        ShortDist = Dist
                                        Hit = I
                                    }
                                }
                                
                                if(placePiece(Hit, Game["Player",number], Game["Cheat",number]) ) {
                                    dsSend("tic tac toe " + Game["Friend UID",string], "MayOS v2", ""+Hit)
                                    
                                    checkGameOver()
                                }
                            }
                            
                        }
                    break
                }   
            }
        }
    }
    elseif(keyClk() == owner() & owner() != User) {
        
    }
}
####################################################################################
#
#                      Chat commands
#
####################################################################################
elseif(chatClk()) { # if updated by chat
    if(chatClk(owner())) {
        local LS = lastSaid()
        
        if(LS:sub(1,5) == "!cmd ") {
            addText("Remote command: " + LS:sub(6),vec(255),2)
            updateConsole()
            doCommand(LS:sub(6))
        }
        elseif(LS == "!summon") {
            Scr:setPos(owner():shootPos() + owner():eyeAngles():setPitch(0):forward()*40)
            Scr:setAng(owner():eyeAngles():setPitch(90) + ang(0,180,0))
            timer("MoveOtherCrap",100)
        }
    }
}
elseif(fileClk()) {
}
elseif(dsClk()) {
    #print(entity():id() + "Datasig: " + dsClkName() + " " + dsGetString())
    if(dsClkName() == Game["Name",string] + " " + UID) {
        if(dsGetString():sub(1,2) == "n:") {
            if(Game["EGP Opp I",number]) {
                EGP:egpSetText(Game["EGP Opp I",number],"Opponent: " + dsGetString():sub(3))
            }
        }
        else {
            switch(Game["Name",string]) {
                case "tic tac toe",
                    if(dsGetString() == "quit") {
                        #timer("Close Game",100)
                        #addText("Other player quit the game.",vec(200))
                        Game["Friend UID",string] = "null"
                        Game["Player",number] = 1
                        Game["StartTurn",number] = 2
                        Game["Wins",number] = 0
                        Game["Losses",number] = 0
                        EGP:egpSetText(Game["EGP WL I",number], "W: 0")
                        EGP:egpSetText(Game["EGP WL I",number]+1, "L: 0")
                        resetGame()
                    }
                    elseif(dsGetString() == "reset") {
                        resetGame()
                    }
                    else {
                        placePiece(dsGetString():toNumber(), Game["Turn",number], 1)
                        checkGameOver()
                    }
                break
            }
        }
    }
    elseif(dsClkName() == "findgame") {
        #dsSend("gameon", "MayOS v2", "" + (dsGetString() == Game["Name",string]) )
        
        if(dsGetString() == Game["Name",string] & Game["Friend UID",string] == "null") {
            dsSend("UID", "MayOS v2", "" + UID)
            #timer("SendUID",1000)
        }
    }
    elseif(dsClkName() == "UID" & Game["Friend UID",string] == "null") {
        Game["Friend UID",string] = dsGetString()
        dsSend("UID Return", "MayOS v2", "" + UID)
        
        finalGameSetup(2)
    }
    elseif(dsClkName() == "UID Return" & Game["Friend UID",string] == "null") {
        Game["Friend UID",string] = dsGetString()
        
        finalGameSetup(1)
    }
}
elseif(httpClk()) {
    
    switch(httpRequestUrl()) {
        case Update["URL",string],
            Update["UpdateInfo",array] = httpData():explode("\n")
            if(Update["UpdateInfo",array][1,string]:toNumber() > Version:toNumber()) {                
                Update["NewURL",string] = Update["UpdateInfo",array][2,string]:trim()
                timer("GetUpdate",10)
            }
            else {
                addText("  No new update available.",vec(200))
                updateConsole()
            }
        break
        
        case Update["NewURL",string],
            addText("A new update is available!")
            updateConsole()
            Update["NewE2",string] = httpData()
            #Update["NewE2",string] = Update["NewE2",string]:sub(1,10000):replace("Update[\"Updated\",string] = \"\"", "Update[\"Updated\",string] = \"" + dateOnly() + "\"")
            Update["UpdateAvail",number] = 1
            EGP:egpColor(Data["EGP Version I",number], vec(100,0,0))
        break
    }
}
elseif(last()) { # if it is the last tick of the E2 before removal
    dsSend(Game["Name",string] + " " + Game["Friend UID",string], "MayOS v2", "quit")
}
		
		
`;
//fetch("e2.txt")
//	.then(response => response.text())
//	.then(text => txtFull = text);



txtFull += " ";
var txtLines = txtFull.split("\n");

var html = '';

var inType = 'space';
var lineType = '';


var i = 0;

// These are some functions I needed to help interpret the characters:
function isNum(cha) {
	return !isNaN(cha);
}

function charIsLetter(cha) {
  if (typeof cha !== 'string') {
    return false;
  }

  return cha.toLowerCase() !== cha.toUpperCase();
}


// This function looks at the first letter of a new colored section, and determines what group it's in.
function firstOfType(cha) {
	if(cha == " ") {
		return "space";
	}
	else if(cha == "@") {
		return "directive";
	}
	else if("!$%^&*()+=]}[{|:<>,?-".includes(cha)) {
		return "symbol";
	}
	else if(cha == "#") {
		return "comment";
	}
	else if(cha == '"') {
		return "string";
	}
	else if(isNum(cha)) {
		return "number";
	}
	else if(charIsLetter(cha)) { //special variable starters?
		if(cha.toLowerCase() == cha) {
			return "function";
		}
		else {
			return "variable";
		}
	}
	
	return "space";
}

function charFitsCurType(cha, inType) {
	switch(inType) {
		case "comment":
			return "true";
			break;
		
		case "type":
			if(charIsLetter(cha)) {
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
			break;
		
		case "number":
			if(isNum(cha)) {
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
			else if(isNum(cha) || charIsLetter(cha)) {
				if(cha == " ") { console.log("I guess space is a letter."); }
				return "true";
			}
			break;
		
		case "condition":
		case "function":
			if(cha == " ") {
				return "false";
			}
			else if(isNum(cha) || charIsLetter(cha)) {
				return "true";
			}
			break;
		
		case "symbol":
			if("!$%^&*()-_]}[{|:<>,?".includes(cha)) {
				return "true";
			}
			break;
		
		case "string":
			if(cha == '"') {
				return "close";
			}
			return "true";
			break;
		
	}
	return "false";
}


var line = 1;

html = `<div><span class="nl">1| &nbsp;<\span>`

while(i < txtFull.length) {
	var thisChar = txtFull.charAt(i);
	
	if(thisChar == '\n') {
		if(inType != "mlcomment" && inType != "quote") {
			inType = "space"
		}
		line++;
		html += `</span></div><div><span class="nl">${line}| &nbsp;</span><span class="${inType}">`;
	}
	else { 
		var charFit = charFitsCurType(thisChar, inType);
		
		if(charFit == "true") { // if the current char matches the type, add and move on.
			
			if(thisChar == " ") {
				thisChar = "&nbsp;";
			}
			html += thisChar;
			//console.log("Added: " + thisChar);
		}
		else if(charFit == "close") { // if it's in a string and you find a quote, close the string.
			html += '"</span>';
			inType = "space";
		}
		else if(charFit == "check") { // if you see a ] in a mlcomment, see if the comment is over
			if(txtFull.charAt(i+1) == "#") {
				html += "]#</span>";
				i++;
				inType = "space";
			}
			else {
				html += "]";
			}	
		}
		else if(charFit == "pretype") {
			inType = "type";
			html += `</span><span class="symbol">:</span><span class="type">`
		}
		else {// we are about to start a new type ...
		
			inType = firstOfType(thisChar);
			
			if(inType == "comment") {
				if(txtFull.charAt(i+1) == "[") { // it's a mlcomment
					inType = `ml${inType}`;
				}
			}
			else if(inType == "function") {
				var restOfWord = '';
				
				var j = i;
				
				while(j < txtFull.length) {
					var thatChar = txtFull.charAt(j);
					if(!thatChar.match(/[a-z]/i)) {
						break;
					}
					restOfWord += thatChar;
					
					j++;
				}
				
				//console.log("function check: " + restOfWord);
				
				if("if elseif for else while function case break continue switch local return default".split(" ").includes(restOfWord)) {
					//console.log("I guess this is a cond:" + restOfWord);					
					inType = "condition";
				}
			}
				
				
			
			html += `</span><span class="${inType}">${thisChar}`;
			
			if(inType == "directive") { 
				var restOfWord = '';
				
				var j = i;
				
				while(j < txtFull.length) {
					var thatChar = txtFull.charAt(j);
					if(thatChar == " ") {
						break;
					}
					restOfWord += thatChar;
					
					j++;
				}
				
				i++;
				
				while(i < txtFull.length) {
					var thatChar = txtFull.charAt(i);
					if(restOfWord == "@name" || restOfWord == "@model") {
						if(thatChar == "\n") {
							i--;
							break;
						}
					}
					else {
						if(thatChar == " ") {
							i--;
							break;
						}
					}
					
					html+=thatChar;
					i++;
				}
			}
		}
	}
	
	
	i++;
}

document.write(html);


/*

In comment -> no break
gray rest of line

In mlcomment -> ]#
gray until close symobl

In string -> "
gray until close symbol

In Variable -> space, symbol
green until space or symbol

In Function -> space, symbol
blue until space or symbol

In Number -> Not in anything else? red until anything else




if you're in space and you hit a:

Upper Letter, green until space or symbol

lower letter, blue until space or symbol

quote, comment, or mlcomment, then gray until termination

number, red until anything else
	


types:

quotes/comments/mlcomments
atlines
space
symbol
number
variable
function
special (custom function)

operations: identify quotes, comments, and ml comments

identify 



*/