var _EOF_ = "EOF";
var _NUMBER_ = "NUMBER";
var _ERROR_ = "ERROR";
var _IDENTIFIER_ = "IDENTIFIER";
var _OPERATOR_ = "OPERATOR";

var input = "This is (42 + 24;";
var head = 0;
var currenToken;
var value;

function isEOL(character) {
	return character == ";";
}

function isSpace(character) {
	return character == ' ';
}

function isAlpha(character) {
	return character.match(/[a-zA-Z]/) != null;
}

function isAlphaNum(character) {
	return character.match(/[a-zA-Z0-9]/) != null;
}

function isNumeric(character) {
	return character.match(/[0-9]/) != null;
}

function isOperator(character) {
	return character.match(/[\+\-\*\/]/) != null;
}

function nextToken() {
	var token = {};
	var character = input[head];
	while (isSpace(character)) {
		head++;
		character = input[head];
	}
	if (isAlpha(character)) {
		var start = head;
		while (isAlphaNum(character)) {
			head++;
			character = input[head];
		}
		token.type = _IDENTIFIER_;
		token.value = input.substring(start, head);
		return token;
	}
	if (isNumeric(character)) {
		var start = head;
		while(isNumeric(character)) {
			head++;
			character = input[head];
		}
		token.type = _NUMBER_;
		token.value = input.substring(start, head);
		return token;
	}
	if (isOperator(character)) {
		token.type = _OPERATOR_;
		token.value = character;
		head++;
		return token;
	}
	if (isEOL(character)) {
		token.type = _EOF_;
		token.value = character;
		return token;
	}
	token.type = _ERROR_;
	token.value = input.substring(head);
	return token;
}

function main() {
	var token = nextToken();
	while (token.type != _EOF_ && token.type != _ERROR_) {
		console.log(token.type + " : " + token.value);
		token = nextToken();
	}
	if (token.type == _ERROR_) {
		console.log("Unexpected character: " + token.value);
	}
}

main();