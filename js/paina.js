// Based on: http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm

var _EOF_ = "EOF";
var _NUMBER_ = "NUMBER";
var _ERROR_ = "ERROR";
var _IDENTIFIER_ = "IDENTIFIER";
var _OPERATOR_ = "OPERATOR";
var _SENTINEL_ = "SENTINEL";

var input = "";
var head = 0;
var sentinel = {type: _SENTINEL_, value: "@"};

var precedence = {
	"@": 0, // sentinel
	"+": 1,
	"-": 1,
	"*": 2,
	"/": 2
};

var operands = [];
var operators = [sentinel];

function isEOL() {
	return head == input.length;
}

function isSpace() {
	return !isEOL() && input[head] == ' ';
}

function isAlpha() {
	return !isEOL() && input[head].match(/[a-zA-Z]/) != null;
}

function isAlphaNum() {
	return !isEOL() && input[head].match(/[a-zA-Z0-9]/) != null;
}

function isNumeric() {
	return !isEOL() && input[head].match(/[0-9]/) != null;
}

function isOperator() {
	return !isEOL() && input[head].match(/[\+\-\*\/]/) != null;
}

function getNextToken() {
	var token = {};
	while (isSpace()) {
		head++;
	}
	if (isAlpha()) {
		var start = head;
		while (isAlphaNum()) {
			head++;
		}
		token.type = _IDENTIFIER_;
		token.value = input.substring(start, head);
		return token;
	}
	if (isNumeric()) {
		var start = head;
		while(isNumeric()) {
			head++;
		}
		token.type = _NUMBER_;
		token.value = input.substring(start, head);
		return token;
	}
	if (isOperator()) {
		token.type = _OPERATOR_;
		token.value = input[head];
		head++;
		return token;
	}
	if (isEOL()) {
		token.type = _EOF_;
		return token;
	}
	token.type = _ERROR_;
	token.value = input.substring(head);
	return token;
}

function nodePlus(left, right) {
	return {
		type: "+",
		left: left,
		right: right,
		value: function () {
			return this.left.value() + this.right.value();
		}
	};
}

function nodeMinus(left, right) {
	return {
		type: "-",
		left: left,
		right: right,
		value: function () {
			return this.left.value() - this.right.value();
		}
	};
}

function nodeTimes(left, right) {
	return {
		type: "*",
		left: left,
		right: right,
		value: function () {
			return this.left.value() * this.right.value();
		}
	};
}

function nodeDivide(left, right) {
	return {
		type: "/",
		left: left,
		right: right,
		value: function () {
			return this.left.value() / this.right.value();
		}
	};
}

function nodeNumber(number) {
	return {
		type: _NUMBER_,
		number: parseInt(number),
		value: function () {
			return this.number;
		}
	};
}

function nodeError(error) {
	return {
		type: _ERROR_,
		error: error,
		value: function () {
			return "(Error: " + error + ")";
		}
	};
}

function makeNode() {
	var operator = operators.pop();
	var right = operands.pop();
	var left = operands.pop();
	switch (operator.value) {
		case "+":
			return nodePlus(left, right);
		case "-":
			return nodeMinus(left, right);
		case "*":
			return nodeTimes(left, right);
		case "/":
			return nodeDivide(left, right);
		default:
			return nodeError("Invalid operator");
	}
}

function topOperator() {
	return operators.slice(-1)[0];
}

function topOperands() {
	return operands.slice(-1)[0];
}

function popOperator() {
	operands.push(makeNode());
}

function pushOperator(operator) {
	while (precedence[topOperator().value] >= precedence[operator.value]) {
		popOperator();
	}
	operators.push(operator);
}

function operand() {
	var token = getNextToken();
	switch (token.type) {
		case _NUMBER_:
			operands.push(nodeNumber(token.value));
			return true;
		default:
			return false;
	}
}

function parser() {
	operand();
	var token = getNextToken();
	while (token.type == _OPERATOR_) {
		pushOperator(token);
		operand();
		token = getNextToken();
	}
	while (topOperator().type != _SENTINEL_) {
		popOperator();
	}
	return topOperands();
}

function reset() {
	input = "";
	head = 0;
	operands = [];
	operators = [sentinel];
}
