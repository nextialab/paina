var _EOF_ = "EOF";
var _NUMBER_ = "NUMBER";
var _ERROR_ = "ERROR";
var _IDENTIFIER_ = "IDENTIFIER";
var _OPERATOR_ = "OPERATOR";

var input = "1 + 2 * 5 + 10 - 3 * 5;";
var head = 0;

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

function nodePlus(left, right) {
	this.type = "+";
	this.left = left;
	this.right = right;
	this.value = function () {
		return this.left.value() + this.right.value();
	};
}

function nodeMinus(left, right) {
	this.type = "-";
	this.left = left;
	this.right = right;
	this.value = function () {
		return this.left.value() - this.right.value();
	};
}

function nodeTimes(left, right) {
	this.type = "*";
	this.left = left;
	this.right = right;
	this.value = function () {
		return this.left.value() * this.right.value();
	};
}

function nodeDivide(left, right) {
	this.type = "/";
	this.left = left;
	this.right = right;
	this.value = function () {
		return this.left.value() / this.right.value();
	}
}

function nodeNumber(number) {
	this.type = _NUMBER_;
	this.number = parseInt(number);
	this.value = function () {
		return this.number;
	};
}

function nodeError(error) {
	this.type = _ERROR_;
	this.error = error;
	this.value = function () {
		return "(Error: " + error + ")";
	}
}

function getAst() {
	var token = nextToken();
	switch (token.type) {
		case _NUMBER_:
	  	var next = nextToken();
			switch (next.type) {
				case _OPERATOR_:
					switch (next.value) {
						case "+":
							return new nodePlus(new nodeNumber(token.value), getAst());
						case "-":
			  			return new nodeMinus(new nodeNumber(token.value), getAst());
						case "*":
						  var ast = getAst();
							switch (ast.type) {
								case "+":
								case "-":
								  var astTimes = new nodeTimes(new nodeNumber(token.value), ast.left);
									ast.left = astTimes;
									return ast;
								default:
							  	return new nodeTimes(new nodeNumber(token.value), ast);
							}
						case "/":
						  var ast = getAst();
							switch (ast.type) {
								case "+":
								case "-":
									var astDivide = new nodeDivide(new nodeNumber(token.value), ast.left);
									ast.left = astDivide;
									return ast;
							}
						default:
			  			return new nodeError("Operator " + next.value + " not supported");
					}
				case _EOF_:
				  return new nodeNumber(token.value);
				default:
				  return new nodeError("Operator or end of line expected");
			}
		default:
	  	return new nodeError("Number expected");
	}
}

function main() {
	var ast = getAst();
	console.log(ast.value());
}

main();
