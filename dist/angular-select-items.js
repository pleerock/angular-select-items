/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name selectItems
     *
     * This directive provides a ability to select items from the given list to the given model.
     * Supports both multiple and single select modes.
     */
    angular.module('selectItems', ['selectOptions', 'disableAll', 'ngSanitize']);

})();
angular.module("selectItems").run(["$templateCache", function($templateCache) {$templateCache.put("select-items.html","<div class=\"select-items\"\n     ng-show=\"search\n            || (loadingInProgress && loadingLabel)\n            || (multiselect && selectAll && getDisplayedItems().length > 0)\n            || (!multiselect && !autoSelect && !hideNoSelection && noSelectionLabel)\n            || getDisplayedItems().length > 0\"\n        disable-all=\"disabled\"> <!-- todo: try to cache displayed items length -->\n    <ul>\n        <li ng-show=\"loadingInProgress\" class=\"select-list-item\">{{ loadingLabel }}</li>\n        <li ng-show=\"search && !loadingInProgress\" class=\"select-items-search select-list-item\">\n            <input ng-model=\"searchKeyword\" ng-attr-placeholder=\"{{ searchPlaceholder }}\">\n        </li>\n        <li class=\"select-all select-list-item\"\n            ng-class=\"{ \'can-be-active\' : activeItem === null }\"\n            ng-show=\"multiselect && selectAll && getDisplayedItems().length > 0\"\n            ng-mouseover=\"setActiveItem(null)\"\n            ng-click=\"toggleAllItemsSelection()\">\n            <input ng-show=\"!hideControls\" type=\"checkbox\" ng-checked=\"areAllItemsSelected()\">\n            <span class=\"select-all\">{{ areAllItemsSelected() ? deselectAllLabel : selectAllLabel }}</span>\n        </li>\n        <li ng-show=\"!multiselect && !autoSelect && !hideNoSelection && noSelectionLabel && getDisplayedItems().length > 0\"\n            ng-click=\"selectItem()\"\n            ng-mouseover=\"setActiveItem(null)\"\n            ng-class=\"{ \'active\' : !activeItem }\"\n            class=\"no-selection select-list-item\">\n            <input ng-show=\"!hideControls\" type=\"radio\" ng-checked=\"!isAnyItemSelected()\"> {{ noSelectionLabel }}\n        </li>\n        <li ng-repeat=\"item in getDisplayedItems()\"\n            class=\"select-item\">\n            <div class=\"select-item-container\">\n                <div class=\"select-list-item select-items-group\"\n                     ng-class=\"{ \'all-selected\': areAllGroupItemsSelected(item), \'select-all-enabled\': groupSelectAll }\"\n                     ng-mouseover=\"setActiveItem(null)\"\n                     ng-show=\"($index === 0 || getItemGroup(item) !== getItemGroupOfItemsAt($index - 1)) && getItemGroup(item)\"\n                     ng-click=\"toggleGroupItemsSelection(item)\">\n                    <input class=\"item-control\"\n                           ng-show=\"groupSelectAll\"\n                           type=\"checkbox\"\n                           ng-checked=\"areAllGroupItemsSelected(item)\">\n                    <span class=\"select-item-group-template\" ng-bind-html=\"getItemGroup(item)\"></span>\n                </div>\n                <div class=\"select-list-item\"\n                     ng-mouseover=\"setActiveItem(item)\"\n                     ng-click=\"selectItem(item)\"\n                     ng-class=\"{ \'active\' : activeItem === item, \'selected\': isItemSelected(item) }\">\n                    <input class=\"item-control\"\n                           ng-show=\"!hideControls\"\n                           ng-attr-type=\"{{ multiselect ? \'checkbox\' : \'radio\' }}\"\n                           ng-disabled=\"selectionLimit > 0 && ngModel.length >= selectionLimit && !isItemSelected(item)\"\n                           ng-checked=\"isItemSelected(item)\">\n                    <span class=\"select-item-template\" ng-bind-html=\"getItemName(item)\"></span>\n                </div>\n            </div>\n        </li>\n    </ul>\n</div>");}]);
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
/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name selectItemsConfiguration
     * @description
     * Default select-items configuration.
     */
    angular.module('selectItems').constant('selectItemsConfiguration', {
        searchPlaceholder: 'Type to search',
        selectAllLabel:   'Select all',
        deselectAllLabel: 'Deselect all',
        noSelectionLabel: 'Nothing is selected',
        loadingLabel: '',
        loadMinQueryLength: 3,
        loadDelay: 300,
        showLimit: null
    });


})();
/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name selectItems
     * @restrict E
     * @description
     * This directive provides a ability to select items from the given list to the given model.
     * Supports both multiple and single select modes.
     *
     * @param {expression} ngModel Model that will be changed
     * @param {expression} onChange Expression to be evaluated when model is changed
     * @param {expression} selectOptions Options to be parsed and used for items data source and other options
     * @param {boolean} disabled If set to true then all interactions with the component will be disabled
     * @param {boolean} multiselect If set to true then user can select multiple options from the list of items. In this
     *                              case ng-model will be an array. If set to false then user can select only one option
     *                              from the list of items. In this case ng-model will not be array
     * @param {number} showLimit Maximal number of items to show in the list
     * @param {number} selectionLimit Maximal number of items that are allowed to be selected
     * @param {boolean} search If set to true, then search input will be shown to the user, where he can peform a search
     *                          in the list of items
     * @param {Function} searchFilter Filter that controls the result of the search input
     * @param {expression|object} searchKeyword Model used to be a search keyword that user types in the search box
     * @param {boolean} autoSelect If set to true, then first item of the give select-items will be selected.
     *                             This works only with single select
     * @param {boolean} selectAll If set to true, then "select all" option will be shown to user. This works only when
     *                              multiple items mode is enabled
     * @param {boolean} groupSelectAll If set to true, then "select all" option will be shown to user. This works only
     *                                  when item groups are enabled
     * @param {boolean} hideControls If set to true, then all select-items controls will be hidden. Controls such as
     *                               checkboxes and radio boxes
     * @param {boolean} hideNoSelection If set to true, then all "nothing is selected" label and checkbox will not be
     *                                      shown. This label show only in single select mode
     * @param {string} searchPlaceholder Custom placeholder text that will be in the search box
     * @param {string} selectAllLabel Custom text that will be used as a "select all" label.
     *                                  This label show only in single select mode
     * @param {string} deselectAllLabel Custom text that will be used as a "deselect all" label.
     *                                  This label show only in multi select mode
     * @param {string} noSelectionLabel Custom text that will be used as a "no items selected" label.
     *                                  This label show only in multiselect mode.
     * @param {string} loadingLabel Custom text that will be used to show a message when items are loaded for the first
     *                              time. This works only if loadPromise is given.
     * @param {Function} loadPromise A callback that makes some job (for example $http request) and gets the data to show
     *                              in the items list right after component initialization. Callback must return promise
     *                              that contains a valid data for the select items.
     * @param {Function} loadByKeywordPromise A callback that makes some job (for example $http request) and gets the data
     *                                      to show in the items list when search keyword is changed.
     *                                      Callback must return promise that contains a valid data for the select items.
     * @param {number} loadByKeywordDelay A delay time (in milliseconds) before a loadByKeywordPromise will run
     * @param {number} loadByKeywordMinQueryLength Minimal search keyword query length to make loadByKeywordPromise to run.
     * @param {Array.<Function>} filters Filters used to filter out values that must not be shown.
     * @param {Function} decorator Custom decorator used to change a view of the list item
     * @param {Function} groupDecorator Custom decorator used to change a view of the list item group
     * @param {object} activeItem Item that will be active by default
     * @param {number} modelInsertPosition Optional number that will be used to insert a new model item in multiselect mode.
     */
    angular.module('selectItems').directive('selectItems', selectItems);

    /**
     * @ngdoc controller
     * @name SelectItemsCtrl
     */
    angular.module('selectItems').controller('SelectItemsCtrl', SelectItemsCtrl);

    /**
     * @ngInject
     */
    function selectItems($templateCache) {
        return {
            scope: {
                ngModel: '=',
                disabled: '=?',
                multiselect: '=?',
                showLimit: '=?',
                selectionLimit: '=?',
                search: '=?',
                searchFilter: '=?',
                searchKeyword: '=?',
                autoSelect: '=?',
                selectAll: '=?',
                groupSelectAll: '=?',
                hideControls: '=?',
                hideNoSelection: '=?',
                searchPlaceholder: '@',
                selectAllLabel: '@',
                deselectAllLabel: '@',
                noSelectionLabel: '@',
                loadingLabel: '@',
                loadPromise: '=?',
                loadByKeywordPromise: '=?',
                loadByKeywordDelay: '=?',
                loadByKeywordMinQueryLength: '@',
                filters: '=?',
                decorator: '=?',
                groupDecorator: '=?',
                activeItem: '=?',
                modelInsertPosition: '=?'
            },
            replace: true,
            restrict: 'E',
            require: ['ngModel', 'selectOptions'],
            controller: 'SelectItemsCtrl',
            template: function(element) {
                var html = element.html().trim();
                if (html) return '<div class="select-items">' + html + '</div>';
                return $templateCache.get('select-items.html');
            }
        };
    }

    /**
     * @ngInject
     */
    function SelectItemsCtrl($scope, $element, $attrs, $timeout, orderByFilter, filterFilter, selectItemsConfiguration,
                             SelectItemsActiveItemNavigator, selectItemsHighlightWordFilter) {

        // ---------------------------------------------------------------------
        // Scope variables
        // ---------------------------------------------------------------------

        $scope.showLimit                     = $scope.showLimit          ? parseInt($scope.showLimit) : selectItemsConfiguration.showLimit;
        $scope.searchPlaceholder             = $scope.searchPlaceholder || selectItemsConfiguration.searchPlaceholder;
        $scope.selectAllLabel                = $scope.selectAllLabel    || selectItemsConfiguration.selectAllLabel;
        $scope.deselectAllLabel              = $scope.deselectAllLabel  || selectItemsConfiguration.deselectAllLabel;
        $scope.noSelectionLabel              = $scope.noSelectionLabel  || selectItemsConfiguration.noSelectionLabel;
        $scope.loadingLabel                  = $scope.loadingLabel      || selectItemsConfiguration.loadingLabel;
        $scope.loadByKeywordMinQueryLength   = $scope.loadByKeywordMinQueryLength ? parseInt($scope.loadByKeywordMinQueryLength) : selectItemsConfiguration.loadMinQueryLength;
        $scope.loadByKeywordDelay            = $scope.loadByKeywordDelay ? parseInt($attrs.loadByKeywordDelay) : selectItemsConfiguration.loadByKeywordDelay;

        // ---------------------------------------------------------------------
        // Local variables
        // ---------------------------------------------------------------------
        var ngModelCtrl        = $element.controller('ngModel');
        var selectOptionsCtrl  = $element.controller('selectOptions');
        var loadTimeoutPromise = null;
        var loadedItems        = [];

        // ---------------------------------------------------------------------
        // Local functions
        // ---------------------------------------------------------------------

        /**
         * Loads items (usually from the remote server). Load callback must return a promise
         * to get the target object.
         *
         * @param {*} loadPromise Load callback that must return promise
         * @param {*} [value] Value to be sent to the promise object.
         */
        var loadItems = function(loadPromise, value) {
            $scope.loadingInProgress = true;
            loadedItems = [];
            loadPromise(value).then(function(response) {
                if (response.data && angular.isArray(response.data))
                    loadedItems = response.data;
                $scope.loadingInProgress = false;

            }, function(error) {
                $scope.loadingInProgress = false;
                throw error;
            });
        };

        // ---------------------------------------------------------------------
        // Scope functions
        // ---------------------------------------------------------------------

        /**
         * Gets the item name that will be used to display in the list.
         *
         * @param {Object} item
         * @returns {string}
         */
        $scope.getItemGroup = function(item) {
            var value = selectOptionsCtrl.parseItemGroup(item);
            if (value)
                value = String(value).replace(/<[^>]+>/gm, ''); // strip html from the data here

            return $scope.groupDecorator ? $scope.groupDecorator(item) : value;
        };

        /**
         * Gets the group of the item on specific position of the displayed items.
         *
         * @param {number} index
         * @returns {string}
         */
        $scope.getItemGroupOfItemsAt = function(index) {
            return $scope.getItemGroup($scope.getDisplayedItems()[index]);
        };

        /**
         * Gets the item name that will be used to display in the list.
         *
         * @param {Object} item
         * @returns {string}
         */
        $scope.getItemName = function(item) {
            var value = selectOptionsCtrl.parseItemName(item);
            value = String(value).replace(/<[^>]+>/gm, ''); // strip html from the data here
            return $scope.decorator ? $scope.decorator(item) : selectItemsHighlightWordFilter(value, $scope.searchKeyword);
        };

        /**
         * Gets the items that will be used as an options for the model.
         *
         * @returns {Object[]}
         */
        $scope.getItems = function() {
            var items = selectOptionsCtrl.parseItems() || [];

            // append loaded items if they exists
            if (loadedItems.length > 0)
                items = items.concat(loadedItems);

            // apply custom user filters to the items
            if ($scope.filters)
                angular.forEach($scope.filters, function(filter) {
                    items = filter(items);
                });

            // limit number of items if necessary
            if ($scope.showLimit && items.length > $scope.showLimit)
                items = items.slice(0, $scope.showLimit);

            return items;
        };

        /**
         * Gets the items that will be shown in the list.
         * What it does it appends  | orderBy: orderProperty | filter: itemSearch
         * to the #getItems method, but in js-code level to get the list of real displayed items.
         *
         * @returns {Object[]}
         */
        $scope.getDisplayedItems = function() {
            var items = $scope.getItems();
            if ($scope.searchKeyword)
                items = filterFilter(items, $scope.searchKeyword, $scope.searchFilter);
            if (selectOptionsCtrl.getOrderBy())
                items = orderByFilter(items, selectOptionsCtrl.getOrderBy());
            if (selectOptionsCtrl.getGroupBy())
                items = orderByFilter(items, selectOptionsCtrl.getGroupByWithoutPrefixes());

            return items;
        };

        /**
         * Checks if given item is selected.
         *
         * @param {object} item
         * @returns {boolean}
         */
        $scope.isItemSelected = function(item) {
            var model = ngModelCtrl.$modelValue;
            var value = selectOptionsCtrl.parseItemValue(item);
            var trackByProperty = selectOptionsCtrl.getTrackBy();
            var trackByValue    = selectOptionsCtrl.parseTrackBy(item);

            // if no tracking specified simple compare object in the model
            if (!trackByProperty || !trackByValue)
                return $scope.multiselect ? (model && model.indexOf(value) !== -1) : model === value;

            // if tracking is specified then searching is more complex
            if ($scope.multiselect) {
                var isFound = false;
                angular.forEach(model, function(m) {
                    if (m[trackByProperty] === trackByValue)
                        isFound = true;
                });
                return isFound;
            }

            return model[trackByProperty] === trackByValue;
        };

        /**
         * Checks if any item is selected.
         *
         * @param {*} item
         */
        $scope.areAllGroupItemsSelected = function(item) {
            if (!$scope.multiselect) return;

            var displayedItems = $scope.getDisplayedItems();
            var itemGroup = $scope.getItemGroup(item);
            var isAnyNotSelected = false;

            angular.forEach(displayedItems, function(displayedItem) {
                if (itemGroup === $scope.getItemGroup(displayedItem))
                    isAnyNotSelected = isAnyNotSelected || !$scope.isItemSelected(displayedItem);
            });

            return isAnyNotSelected === false;
        };

        /**
         * Checks if any item is selected.
         *
         * @returns {boolean}
         */
        $scope.isAnyItemSelected = function() {
            if ($scope.multiselect)
                return ngModelCtrl.$modelValue && ngModelCtrl.$modelValue.length > 0;

            return ngModelCtrl.$modelValue ? true : false;
        };

        /**
         * Checks if all items are selected or not.
         *
         * @returns {boolean}
         */
        $scope.areAllItemsSelected = function() {
            var items = $scope.getDisplayedItems();
            var isAnyNotSelected = false;

            angular.forEach(items, function(item) {
                isAnyNotSelected = isAnyNotSelected || !$scope.isItemSelected(item);
            });

            return isAnyNotSelected === false;
        };

        /**
         * Selects a given item.
         *
         * @param {object} item
         */
        $scope.selectItem = function(item) {

            var value = selectOptionsCtrl.parseItemValue(item);
            var newSelection = false;
            var index = null;

            // if simple, not multiple mode then
            var model = value;
            if ($scope.multiselect) { // otherwise dealing with multiple model
                model = ngModelCtrl.$modelValue || [];

                if (!$scope.isItemSelected(item) && value !== null) { // in the case if we want to add a new item

                    // if we already reached the limit of selection
                    if (model.length >= $scope.selectionLimit)
                        return;

                    if (angular.isDefined($scope.modelInsertPosition))
                        model.splice($scope.modelInsertPosition, 0, value);
                    else
                        model.push(value);

                    index = $scope.modelInsertPosition;
                    newSelection = true;

                } else { // in the case if we want to remove item from the model
                    var itemInModel = selectOptionsCtrl.findItemInModel(item, model); // this way we find a real matched item from the model
                    model.splice(model.indexOf(itemInModel), 1); // find its index in the model and remove it
                }
            }

            ngModelCtrl.$setViewValue(model);
            if ($attrs.onChange) {
                console.log($attrs.onChange);
                $timeout(function() {
                    selectOptionsCtrl.applyOnScope($attrs.onChange);
                })
            }

            // tell others that use selected item
            var eventData = { item: item, isMultiselect: $scope.multiselect, isNewSelection: newSelection, index: index, element: $element[0] };
            $scope.$emit('select-items.item_selected', eventData);
        };

        /**
         * Selects all items in the list.
         */
        $scope.selectAllItems = function() {
            if (!$scope.multiselect) return;

            var items = $scope.getDisplayedItems();
            angular.forEach(items, function(item) {
                if (!$scope.isItemSelected(item))
                    $scope.selectItem(item);
            });
        };

        /**
         * Deselects all items in the list.
         */
        $scope.deselectAllItems = function() {
            if (!$scope.multiselect) return;

            var items = $scope.getDisplayedItems();
            angular.forEach(items, function(item) {
                if ($scope.isItemSelected(item))
                    $scope.selectItem(item);
            });
        };

        /**
         * Toggles all items selection state - if items are selected,
         * then it deselects them, if items are not selected - then selects them.
         */
        $scope.toggleAllItemsSelection = function() {
            if ($scope.areAllItemsSelected())
                $scope.deselectAllItems();
            else
                $scope.selectAllItems();
        };

        /**
         * Selects all items in the given item group.
         *
         * @param {*} item
         */
        $scope.selectGroupItems = function(item) {
            if (!$scope.multiselect || !$scope.groupSelectAll) return;

            var itemGroup = $scope.getItemGroup(item);
            var displayedItems = $scope.getDisplayedItems();

            angular.forEach(displayedItems, function(displayedItem) {
                if (itemGroup === $scope.getItemGroup(displayedItem) && !$scope.isItemSelected(displayedItem))
                    $scope.selectItem(displayedItem);
            });
        };

        /**
         * Deselects all items in the list.
         *
         * @param {*} item
         */
        $scope.deselectGroupItems = function(item) {
            if (!$scope.multiselect || !$scope.groupSelectAll) return;

            var itemGroup = $scope.getItemGroup(item);
            var displayedItems = $scope.getDisplayedItems();

            angular.forEach(displayedItems, function(displayedItem) {
                if (itemGroup === $scope.getItemGroup(displayedItem) && $scope.isItemSelected(displayedItem))
                    $scope.selectItem(displayedItem);
            });
        };

        /**
         * Toggles items of the given item's group selection state - if items are selected,
         * then it deselects them, if items are not selected - then selects them.
         *
         * @param {*} item
         */
        $scope.toggleGroupItemsSelection = function(item) {
            if (!$scope.multiselect || !$scope.groupSelectAll) return;

            if ($scope.areAllGroupItemsSelected(item))
                $scope.deselectGroupItems(item);
            else
                $scope.selectGroupItems(item);
        };

        /**
         * Sets a given item as active.
         *
         * @param {object} item
         */
        $scope.setActiveItem = function(item) {
            $scope.activeItem = item;
        };

        // ---------------------------------------------------------------------
        // Watchers
        // ---------------------------------------------------------------------

        if ($scope.loadByKeywordPromise) {
            $scope.$watch('searchKeyword', function(keyword) {
                if ($scope.loadByKeywordPromise && keyword && keyword.length >= $scope.loadByKeywordMinQueryLength) {
                    if (loadTimeoutPromise !== null)
                        $timeout.cancel(loadTimeoutPromise);

                    loadTimeoutPromise = $timeout(function() { loadItems($scope.loadByKeywordPromise, keyword); }, $scope.loadByKeywordDelay);
                }
            });
        }

        // ---------------------------------------------------------------------
        // Event listeners
        // ---------------------------------------------------------------------

        // when this event comes it makes active a next item in the list of displayed items as active
        $scope.$on('select-items.active_next', function() {
            var activeItem = SelectItemsActiveItemNavigator.previous($scope.getDisplayedItems(), $scope.activeItem);
            if (activeItem || !$scope.multiselect) {
                $scope.activeItem = activeItem;
            }
        });

        // when this event comes it makes active a previous item in the list of displayed items
        $scope.$on('select-items.active_previous', function() {
            $scope.activeItem = SelectItemsActiveItemNavigator.next($scope.getDisplayedItems(), $scope.activeItem);
        });

        // when this event comes it selects (adds to the model) a currently active item
        var _this = this;
        $scope.$on('select-items.select_active', function(event) {
            event.isItemSelected = _this.selectActive();
        });

        // cleanup after directive and its scope is destroyed
        $scope.$on('$destroy', function() {
            if (loadTimeoutPromise)
                $timeout.cancel(loadTimeoutPromise);
        });

        this.selectActive = function() {
            var displayedItems = $scope.getDisplayedItems();
            if (displayedItems.length > 0 && displayedItems.indexOf($scope.activeItem) !== -1) {
                $scope.selectItem($scope.activeItem);
                return true;
            }

            return false;
        };

        // ---------------------------------------------------------------------
        // Initialization
        // ---------------------------------------------------------------------

        // if auto-select option is given then auto select first item in the displayed list of items
        if ($scope.autoSelect) {
            var displayedItems = $scope.getDisplayedItems();
            if (displayedItems.length > 0)
                $scope.selectItem(displayedItems[0]);
        }

        // watch for load promise and load items when its changed
        $scope.$watch('loadPromise', function(loadPromise) {
            if (!loadPromise) return;
            loadItems(loadPromise);
        });

    }

})();
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