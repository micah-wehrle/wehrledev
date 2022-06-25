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

var txtFull = `		
@name Test
@persist Info:string

if(first()) {
	for(I = 1, 10) {
		Info = I + ": " I*2

		if(I == 5) {
			break
		}
	}

	# What am I even doing?

}

#[ " " testing
This really should be
]# A = 1 #interesting!

owner():applyForce(vec(0, 0, 10000))


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
		html += `</span></div>\n<div><span class="nl">${line}| &nbsp;</span><span class="${inType}">`;
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