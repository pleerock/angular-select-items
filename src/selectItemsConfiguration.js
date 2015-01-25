'use strict';

/**
 * Default select-items configuration.
 *
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
angular.module('selectItems').constant('selectItemsConfiguration', {
    searchPlaceholder: 'Type to search',
    selectAllLabel:   'Select all',
    deselectAllLabel: 'Deselect all',
    noSelectionLabel: 'Nothing is selected',
    loadingLabel: '',
    loadMinQueryLength: 1,
    loadDelay: 300,
    showLimit: null
});