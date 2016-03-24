// Based on: http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm

var Token = (function () {
	var EOF = 0;
	var NUMBER = 1;
	var OPERATOR = 2;
	var IDENTIFIER = 3;
	var WHILE = 4;
	var IF = 5;
	var OP = 6;
	var CP = 7;
	var SENTINEL = 8;
	var ERROR = 9;
	return {
		EOF: EOF,
		NUMBER: NUMBER,
		OPERATOR: OPERATOR,
		IDENTIFIER: IDENTIFIER,
		WHILE: WHILE,
		IF: IF,
		SENTINEL: SENTINEL,
		tokenError: function (error) {
			return {
				value: error,
				type: ERROR;
			}
		}
		tokenEOF: function () {
			return {
				type: EOF
			};
		},
		tokenNumber: function (number) {
			return {
				value: number,
				type: NUMBER
			};
		},
		tokenOperator: function (operator) {
			return {
				value: operator,
				type: OPERATOR
			};
		},
		tokenSentinel: function () {
			return {
				type: SENTINEL;
			};
		},
		tokenOpenParenthesis: function () {
			return {
				type: OP;
			}
		},
		tokenCloseParenthesis: function () {
			return {
				type: CP;
			}
		},
		tokenIdentifier: function (identifier) {
			return {
				value: identifier,
				type: IDENTIFIER
			};
		}
	};
})();

var Node = (function () {
	var NUMBER = 0;
	var PLUS = 1;
	var MINUS = 2;
	var TIMES = 3;
	var DIVIDES = 4;
	var ASSIGNMENT = 5;
	var EQUAL = 6;
	var LT = 7;
	var GT = 8;
	var LOE = 9;
	var GOE = 10;
	var OR = 11;
	var AND = 12;
	var NOT = 13;
	var EXP = 14;
	return {
		NUMBER: NUMBER,
		PLUS: PLUS,
		MINUS: MINUS,
		TIMES: TIMES,
		DIVIDES: DIVIDES,
		ASSIGNMENT: ASSIGNMENT,
		EQUAL: EQUAL,
		LT: LT,
		GT: GT,
		LOE: LOE,
		GOE: GOE,
		OR: OR,
		AND: AND,
		NOT: NOT,
		EXP: EXP,
		nodeNumber: function (number) {
			return {
				number: number,
				type: NUMBER,
				unary: false,
				value: function () {
					return parseInt(this.number);
				}
			}
		},
		nodePlus: function (left, right) {
			return {
				left: left,
				right: right,
				type: PLUS,
				unary: false,
				value: function () {
					return this.left.value() + this.right.value();
				}
			}
		},
		nodeUnaryPlus: function (leaf) {
			return {
				leaf: leaf,
				type: PLUS,
				unary: true,
				value: function () {
					return 1 * this.leaf.value();
				}
			}
		},
		nodeMinus: function (left, right) {
			return {
				left: left,
				right: right,
				type: PLUS,
				unary: false,
				value: function () {
					return this.left.value() - this.right.value();
				}
			}
		},
		nodeUnaryMinus: function (leaf) {
			return {
				leaf: leaf,
				type: PLUS,
				unary: true,
				value: function () {
					return -1 * this.leaf.value();
				}
			}
		}
	};
})();

var Tokenizer = (function () {
	var stream = '';
	var head = 0;
	var last = null;
	function isEOL() {
		return head == input.length;
	}
	function isSpace() {
		return !isEOL() && stream[head] == ' ';
	}
	function isAlpha() {
		return !isEOL() && stream[head].match(/[a-zA-Z]/) != null;
	}
	function isAlphaNum() {
		return !isEOL() && stream[head].match(/[a-zA-Z0-9]/) != null;
	}
	function isNumeric() {
		return !isEOL() && stream[head].match(/[0-9]/) != null;
	}
	function isOperator() {
		return !isEOL() && stream[head].match(/[\+\-\*\/]/) != null;
	}
	function isOpenParenthesis() {
		return !isEOL() && stream[head] == '(';
	}
	function isCloseParenthesis() {
		return !isEOL() && stream[head] == ')';
	}
	return {
		reset: function (string) {
			head = 0;
			stream = string;
			last = null;
		},
		next: function () {
			if (last != null && last.type != SENTINEL) return last;
			while (isSpace()) {
				head++;
			}
			if (isOpenParenthesis()) {
				return Token.tokenOpenParenthesis();
			}
			if (isCloseParenthesis()) {
				return Token.tokenCloseParenthesis();
			}
			if (isAlpha()) {
				var start = head;
				do {
					head++;
				} while(isAlphaNum());
				var identifier = input.substring(start, head);
				head--;
				return Token.tokenIdentifier(identifier);
			}
			if (isNumeric()) {
				var start = head;
				do {
					head++;
				} while(isNumeric());
				var number = input.substring(start, head);
				head--;
				return Token.tokenNumber(number);
			}
			if (isOperator()) {
				var operator = input[head];
				return Token.tokenOperator(operator);
			}
			if (isEOL()) {
				return Token.tokenEOF();
			}
			var remainder = input.substring(head);
			return Token.tokenError(remainder);
		},
		consume: function () {
			head++;
			last = Token.tokenSentinel();
		}
	}
})();

var _EOF_ = "EOF";
var _NUMBER_ = "NUMBER";
var _ERROR_ = "ERROR";
var _IDENTIFIER_ = "IDENTIFIER";
var _OPERATOR_ = "OPERATOR";
var _SENTINEL_ = "SENTINEL";
var _OPAR_ = "OPEN PARENTHESIS";
var _CPAR_ = "CLOSE PARENTHESIS";
var _UNARYMINUS_ = "UNARY_-"

var input = "";
var head = 0;
var sentinel = {type: _SENTINEL_, value: "@"};
var last_token;

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

function isOpenParenthesis() {
	return !isEOL() && input[head] == '(';
}

function isCloseParenthesis() {
	return !isEOL() && input[head] == ')';
}

function consume() {
	head++;
	last_token = sentinel;
}

function getNextToken() {
	if (last_token != null && last_token.type != _SENTINEL_) return last_token;
	var token = {};
	while (isSpace()) {
		head++;
	}
	if (isOpenParenthesis()) {
		token.type = _OPAR_;
		token.value = input[head];
		return token;
	}
	if (isCloseParenthesis()) {
		token.type = _CPAR_;
		token.value = input[head];
		return token;
	}
	if (isAlpha()) {
		var start = head;
		do {
			head++;
		} while(isAlphaNum());
		token.type = _IDENTIFIER_;
		token.value = input.substring(start, head);
		head--;
		return token;
	}
	if (isNumeric()) {
		var start = head;
		do {
			head++;
		} while(isNumeric());
		token.type = _NUMBER_;
		token.value = input.substring(start, head);
		head--;
		return token;
	}
	if (isOperator()) {
		token.type = _OPERATOR_;
		token.value = input[head];
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

function nodeUnaryMinus(expression) {
	return {
		type = _UNARYMINUS_;
		expression = expression;
		value: function () {
			return -1 * this.expression.value();
		}
	}
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

function makeNode(operator, right, left) {
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
	var operator = operators.pop();
	var right = operands.pop();
	var left = operands.pop();
	operands.push(makeNode(operator, right, left));
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
			consume();
			return true;
		case _OPAR_:
			consume();
			operators.push(sentinel);
			expression();
			var next = getNextToken();
			if (next.type == _CPAR_) {
				consume();
				operators.pop();
				return true;
			}
			return false;
		case _OPERATOR_:
			if (token.value == '-') {
				return false;
			}
			return false;
		default:
			return false;
	}
}

function expression() {
	operand();
	var token = getNextToken();
	while (token.type == _OPERATOR_) {
		pushOperator(token);
		consume();
		operand();
		token = getNextToken();
	}
	while (topOperator().type != _SENTINEL_) {
		popOperator();
	}
}

function parser() {
	expression();
	return topOperands();
}

function reset() {
	input = "";
	head = 0;
	operands = [];
	operators = [sentinel];
}
