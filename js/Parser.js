'use strict';
var Parser = function () {
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
}
