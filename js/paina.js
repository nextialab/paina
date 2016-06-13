// Based on: http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
'use strict';
var Paina = (function () {
	var token = Token();
	var tokenizer = Tokenizer();
	var node = Node();
	var parser = Parser();
	return {
		parser: parser
	};
})();
