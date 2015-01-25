/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc filter
     * @name selectItemsHighlightWord
     * @description
     * Makes some part of the given word highlighted - by adding specific class
     */
    angular.module('selectItems').filter('selectItemsHighlightWord', selectItemsHighlightWord);

    /**
     * @returns {Function}
     */
    function selectItemsHighlightWord() {
        return function (string, word) {
            return word ? string.replace(new RegExp('(' + escapeRegExp(word) + ')', 'ig'), '<span class="highlighted">$1</span>') : string;
        };
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

})();