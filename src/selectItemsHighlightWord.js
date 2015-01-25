'use strict';

/**
 * @author Umed Khudoiberdiev
 */
angular.module('selectItems').filter('selectItemsHighlightWord', function () {

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    return function (string, word) {
        return word ? string.replace(new RegExp('(' + escapeRegExp(word) + ')', 'ig'), '<span class="highlighted">$1</span>') : string;
    };
});