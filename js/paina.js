// Based on: http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
'use strict';

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
		OP: OP,
		CP: CP,
		tokenError: function (error) {
			return {
				value: error,
				type: ERROR
			};
		},
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
				type: OPERATOR,
				unary: false
			};
		},
		tokenSentinel: function () {
			return {
				value: '@',
				type: SENTINEL
			};
		},
		tokenOpenParenthesis: function () {
			return {
				value: '(',
				type: OP
			};
		},
		tokenCloseParenthesis: function () {
			return {
				value: ')',
				type: CP
			};
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
			};
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
			};
		},
		nodeUnaryPlus: function (leaf) {
			return {
				leaf: leaf,
				type: PLUS,
				unary: true,
				value: function () {
					return 1 * this.leaf.value();
				}
			};
		},
		nodeMinus: function (left, right) {
			return {
				left: left,
				right: right,
				type: MINUS,
				unary: false,
				value: function () {
					return this.left.value() - this.right.value();
				}
			};
		},
		nodeUnaryMinus: function (leaf) {
			return {
				leaf: leaf,
				type: MINUS,
				unary: true,
				value: function () {
					return -1 * this.leaf.value();
				}
			};
		},
		nodeTimes: function (left, right) {
			return {
				left: left,
				right: right,
				type: TIMES,
				unary: false,
				value: function () {
					return this.left.value() * this.right.value();
				}
			};
		},
		nodeDivides: function (left, right) {
			return {
				left: left,
				right: right,
				type: DIVIDES,
				unary: false,
				value: function () {
					return this.left.value() / this.right.value();
				}
			};
		},
		nodeBinaryOperator: function (operator, left, right) {
			switch (operator) {
				case '+':
					return this.nodePlus(left, right);
				case '-':
					return this.nodeMinus(left, right);
				case '*':
					return this.nodeTimes(left, right);
				case '/':
					return this.nodeDivides(left, right);
			}
		},
		nodeUnaryOperator: function (operator, leaf) {
			switch (operator) {
				case '+':
					return this.nodeUnaryPlus(leaf);
				case '-':
					return this.nodeUnaryMinus(leaf);
			}
		}
	};
})();

var Tokenizer = (function () {
	var stream = '';
	var head = 0;
	var last = null;
	function isEOL() {
		return head == stream.length;
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
			if (last != null && last.type != Token.SENTINEL) return last;
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
				var identifier = stream.substring(start, head);
				head--;
				return Token.tokenIdentifier(identifier);
			}
			if (isNumeric()) {
				var start = head;
				do {
					head++;
				} while(isNumeric());
				var number = stream.substring(start, head);
				head--;
				return Token.tokenNumber(number);
			}
			if (isOperator()) {
				var operator = stream[head];
				return Token.tokenOperator(operator);
			}
			if (isEOL()) {
				return Token.tokenEOF();
			}
			var remainder = stream.substring(head);
			return Token.tokenError(remainder);
		},
		consume: function () {
			head++;
			last = Token.tokenSentinel();
		}
	};
})();

var Parser = (function () {
	var precedence = {'@': 0, '+': 1, '-': 1, '*': 2, '/': 2};
	var operands = [];
	var operators = [];
	function getTopOperator() {
		return operators.slice(-1)[0];
	}
	function getTopOperands() {
		return operands.slice(-1)[0];
	}
	function popOperator() {
		var operator = operators.pop();
		if (operator.unary) {
			var leaf = operands.pop();
			operands.push(Node.nodeUnaryOperator(operator.value, leaf));
		} else {
			var right = operands.pop();
			var left = operands.pop();
			operands.push(Node.nodeBinaryOperator(operator.value, left, right));
		}
	}
	function pushOperator(operator) {
		while (precedence[getTopOperator().value] >= precedence[operator.value]) {
			popOperator();
		}
		operators.push(operator);
	}
	function lookForOperand() {
		var token = Tokenizer.next();
		switch (token.type) {
			case Token.NUMBER:
				operands.push(Node.nodeNumber(token.value));
				Tokenizer.consume();
				return true;
			case Token.OP:
				Tokenizer.consume();
				operators.push(Token.tokenSentinel());
				lookForExpression();
				var next = Tokenizer.next();
				if (next.type === Token.CP) {
					Tokenizer.consume();
					operators.pop();
					return true;
				}
				return false;
			case Token.OPERATOR:
				if (token.value === '+' || token.value === '-') {
					token.unary = true;
					pushOperator(token);
					Tokenizer.consume();
					lookForOperand();
					return true;
				}
				return false;
			default:
				return false;
		}
	}
	function lookForExpression() {
		lookForOperand();
		var token = Tokenizer.next();
		while (token.type === Token.OPERATOR) {
			pushOperator(token);
			Tokenizer.consume();
			lookForOperand();
			token = Tokenizer.next();
		}
		while (getTopOperator().type !== Token.SENTINEL) {
			popOperator();
		}
	}
	return {
		reset: function () {
			operators = [];
			operators.push(Token.tokenSentinel());
		},
		parse: function (input) {
			Tokenizer.reset(input);
			lookForExpression();
			return getTopOperands();
		}
	};
})();
