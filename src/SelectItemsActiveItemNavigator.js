/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name SelectItemsActiveItemNavigator
     */
    angular.module('selectItems').factory('SelectItemsActiveItemNavigator', SelectItemsActiveItemNavigator);

    /**
     * @constructor
     */
    function SelectItemsActiveItemNavigator() {
        return {

            /**
             * @param {Array.<*>} items
             * @param {*} currentSelectedItem
             * @returns {*}
             */
            previous: function(items, currentSelectedItem) {

                // no items - no way to deal here
                if (!items || items.length === 0)
                    return null;

                // select last element if not selections yet
                // if (!currentSelectedItem && items.length > 0)
                //    return items[items.length - 1];

                // select previous item if it exists
                var index = items.indexOf(currentSelectedItem);
                if (index > 0 && items[index - 1]) {
                    return items[index - 1];
                }

                // if previous item does not exist then it means we are on the first element
                return items[0];
            },

            /**
             * @param {Array.<*>} items
             * @param {*} currentSelectedItem
             * @returns {*}
             */
            next: function(items, currentSelectedItem) {

                // no items - no way to deal here
                if (!items || items.length === 0)
                    return null;

                // if not current selection then select first item
                if (!currentSelectedItem)
                    return items[0];

                // select next item if it exists
                var index = items.indexOf(currentSelectedItem);
                if (currentSelectedItem && index > -1 && items[index + 1]) {
                    return items[index + 1];
                }

                // if element not found in the items list then return first element
                if (index === -1)
                    return items[0];

                // if next item does not exist then just stay on the same element
                return currentSelectedItem;
            }

        };
    }


})();