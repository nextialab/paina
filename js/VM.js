'use strict';
var VM = function () {
    var heap = {'test': 10};
    return {
        heap : heap,
        evaluate: function (node) {
            return node.value(heap);
        }
    };
}
