'use strict';
var Tokenizer = function () {
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
		return !isEOL() && stream[head].match(/[\+\-\*\/<>=!]/) != null;
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
                var start = head;
                do {
                    head++;
                } while (isOperator());
				var operator = stream.substring(start, head);
                head--;
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
}
