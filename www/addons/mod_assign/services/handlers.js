// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.mod_assign')

/**
 * Mod assign handlers.
 *
 * @module mm.addons.mod_assign
 * @ngdoc service
 * @name $mmaModAssignHandlers
 */
.factory('$mmaModAssignHandlers', function($mmCourse, $mmaModAssign, $state, $q, $mmContentLinksHelper) {
    var self = {};

    /**
     * Course content handler.
     *
     * @module mm.addons.mod_assign
     * @ngdoc method
     * @name $mmaModAssignHandlers#courseContent
     */
    self.courseContent = function() {

        var self = {};

        /**
         * Whether or not the handler is enabled for the site.
         *
         * @return {Promise}
         */
        self.isEnabled = function() {
            return $mmaModAssign.isPluginEnabled();
        };

        /**
         * Get the controller.
         *
         * @param {Object} module The module info.
         * @param {Number} courseid The course ID.
         * @return {Function}
         */
        self.getController = function(module, courseid) {
            return function($scope) {
                $scope.title = module.name;
                $scope.icon = $mmCourse.getModuleIconSrc('assign');
                $scope.action = function(e) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    $state.go('site.mod_assign', {module: module, courseid: courseid});
                };
            };
        };

        return self;
    };

    /**
     * Content links handler.
     *
     * @module mm.addons.mod_assign
     * @ngdoc method
     * @name $mmaModAssignHandlers#linksHandler
     */
    self.linksHandler = function() {

        var self = {};

        /**
         * Whether or not the handler is enabled for a certain site.
         *
         * @param  {String} siteId     Site ID.
         * @param  {Number} [courseId] Course ID related to the URL.
         * @return {Promise}           Promise resolved with true if enabled.
         */
        function isEnabled(siteId, courseId) {
            return $mmaModAssign.isPluginEnabled(siteId).then(function(enabled) {
                if (!enabled) {
                    return false;
                }
                return courseId || $mmCourse.canGetModuleWithoutCourseId(siteId);
            });
        }

        /**
         * Get actions to perform with the link.
         *
         * @param {String[]} siteIds  Site IDs the URL belongs to.
         * @param {String} url        URL to treat.
         * @param {Number} [courseId] Course ID related to the URL.
         * @return {Promise}          Promise resolved with the list of actions.
         *                            See {@link $mmContentLinksDelegate#registerLinkHandler}.
         */
        self.getActions = function(siteIds, url, courseId) {
            // Check it's an assign URL.
            if (url.indexOf('/mod/assign/view.php') > -1) {
                return $mmContentLinksHelper.treatModuleIndexUrl(siteIds, url, isEnabled, courseId);
            }
            return $q.when([]);
        };

        return self;
    };

    return self;
});
