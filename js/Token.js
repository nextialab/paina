'use strict';
var Token = function () {
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
}
