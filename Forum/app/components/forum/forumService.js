(
    function (app) {
        'use strict';

        var forumService = function ($http, apiURLBase, $q) {

            var forumApiURL = apiURLBase + '/forum/';

            var _getForums = function (categoryId) {

                var deferred = $q.defer();

                deferred.notify("Getting forum information..")
                var forumApiURL = apiURLBase + '/forum/';
                var request = $http({
                    method: "get",
                    url: forumApiURL,
                    params: {
                        action: "get"
                    }
                });

                request.then(
                    function (dataFromServer) {
                        deferred.resolve(dataFromServer)
                    }
                    ,
                    function (responseData) {
                        deferred.reject('Unable to get the forums. Server returned '
                            + responseData.status
                            + " - "
                            + responseData.statusText);
                    }
                );

                return deferred.promise;
            };

            var _saveforum = function (categoryId, forum) {
                var deferred = $q.defer();
                deferred.notify("Updating/Adding Forum...");
                var postRequest = $http.post(forumApiURL + categoryId, forum);

                postRequest.success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    deferred.reject("Unable to save the forum. Server returned - "
                        + data.status
                        + " - "
                        + data.statusText);
                });

                return deferred.promise;
            };

            var _updateforum = function (categoryId, forum) {
                var deferred = $q.defer();
                deferred.notify("Updating...");
                var updateRequest = $http.put(forumApiURL + categoryId, forum);

                updateRequest.success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    deferred.reject("Unable to save the forum. Server returned - "
                        + data.status
                        + " - "
                        + data.statusText);
                });

                return deferred.promise;
            };

            var _deleteforum = function (forumId) {
                var deferred = $q.defer();
                deferred.notify("Deleting...");
                var deleteRequest = $http.delete(forumApiURL + forumId);

                deleteRequest.success(function (data) {
                    deferred.resolve(true);
                }).error(function (data) {
                    deferred.reject("Unable to save the forum. Server returned - "
                        + data.status
                        + " - "
                        + data.statusText);
                });

                return deferred.promise;
            };


            return {
                GetForums: _getForums,
                SaveForum: _saveforum,
                UpdateForum: _updateforum,
                DeleteForum: _deleteforum
            };


        };
        app.factory('forumService', forumService);
    }
)(angular.module('app'));