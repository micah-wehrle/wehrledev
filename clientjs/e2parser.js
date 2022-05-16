var path = window.location.pathname;
var page = path.split('/').pop().replace('.html','');

var txtFull = 'if(Number ifNumber) { print(1) } for For fOr';
txtFull += " ";
var txtLines = txtFull.split("\n");

var html = '';

var inType = 'space';
var lineType = '';


var i = 0;

function isNum(cha) {
	return !isNaN(cha);
}

function charIsLetter(cha) {
  if (typeof cha !== 'string') {
    return false;
  }

  return cha.toLowerCase() !== cha.toUpperCase();
}

function firstOfType(cha) {
	if(cha == " ") {
		return "space";
	}
	else if("!$%^&*()+=]}[{|:<>,?".includes(cha)) {
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
	else if(charIsLetter(cha) || "_-") { //special variable starters?
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
			else if(isNum(cha) || charIsLetter(cha) || cha == "_" || cha == "-") {
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


var line = 2;

html = `<span class="nl">1| &nbsp;<\span>`

while(i < txtFull.length) {
	var thisChar = txtFull.charAt(i);
	
	if(thisChar == '\n') {
		if(inType != "mlcomment" && inType != "quote") {
			inType = "space"
		}
		html += `</span><br><span class="nl">${line}| &nbsp;</span><span class="${inType}">`;
		line++;
	}
	else { 
		var charFit = charFitsCurType(thisChar, inType);
		
		if(charFit == "true") { // if the current char matches the type, add and move on.
			html += thisChar;
			console.log("Added: " + thisChar);
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
				
				console.log("function check: " + restOfWord);
				
				if("if elseif for else while".split(" ").includes(restOfWord)) {
					console.log("I guess this is a cond:" + restOfWord);					
					inType = "condition";
				}
			}
				
				
			
			html += `</span><span class="${inType}">${thisChar}`;
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