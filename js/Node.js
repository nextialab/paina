'use strict';
var Node = function () {
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
    var IDENTIFIER = 15;
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
		nodeNumber: function (_number) {
            var number = _number;
			return {
				type: NUMBER,
				value: function (heap) {
					return parseInt(number);
				}
			};
		},
        nodeIdentifier: function (_identifier) {
            var identifier = _identifier;
            return {
                type: IDENTIFIER,
                value: function (heap) {
                    return heap[identifier];
                }
            }
        },
		nodePlus: function (_left, _right) {
            var left = _left;
            var right = _right;
			return {
				type: PLUS,
				value: function (heap) {
					return left.value(heap) + right.value(heap);
				}
			};
		},
		nodeUnaryPlus: function (_leaf) {
            var leaf = _leaf;
			return {
				type: PLUS,
				value: function (heap) {
					return 1 * leaf.value(heap);
				}
			};
		},
		nodeMinus: function (_left, _right) {
            var left = _left;
            var right = _right;
			return {
				type: MINUS,
				value: function (heap) {
					return left.value(heap) - right.value(heap);
				}
			};
		},
		nodeUnaryMinus: function (_leaf) {
            var leaf = _leaf;
			return {
				type: MINUS,
				value: function (heap) {
					return -1 * leaf.value(heap);
				}
			};
		},
		nodeTimes: function (left, right) {
            var left = _left;
            var right = _right;
			return {
				type: TIMES,
				value: function (heap) {
					return this.left.value(heap) * this.right.value(heap);
				}
			};
		},
		nodeDivides: function (_left, _right) {
            var left = _left;
            var right = _right;
			return {
				type: DIVIDES,
				value: function () {
					return left.value() / right.value();
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
}
