(function (module) {
    var app = module;
    var categoryService = function ($http, apiURLBase, $q) {

        var categoryApiURL = apiURLBase + '/category/';

        var _getCategories = function () {

            var deferred = $q.defer();

            deferred.notify("Getting forum categories..")
            var categoryApiURL = apiURLBase + '/category/';
            var request = $http({
                method: "get",
                url: categoryApiURL,
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
                    deferred.reject('Unable to get the categories. Server returned '
                        + responseData.status
                        + " - "
                        + responseData.statusText);
                }
            );

            return deferred.promise;
        };


        var _getCategoryById = function (categoryId) {

            var deferred = $q.defer();

            deferred.notify("Getting forum categories..")
            var categoryApiURL = apiURLBase + '/category/' + categoryId;
            var request = $http({
                method: "get",
                url: categoryApiURL,
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
                    deferred.reject('Unable to get the category. Server returned '
                        + responseData.status
                        + " - "
                        + responseData.statusText);
                }
            );

            return deferred.promise;
        };

        var _saveCategory = function (category) {
            var deferred = $q.defer();
            deferred.notify("Updating...");
            var postRequest = $http.post(categoryApiURL, category);

            postRequest.success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject("Unable to save the category. Server returned - "
                    + data.status
                    + " - "
                    + data.statusText);
            });

            return deferred.promise;
        };

        var _updateCategory = function (categoryId, category) {
            var deferred = $q.defer();
            deferred.notify("Updating...");
            var updateRequest = $http.put(categoryApiURL + categoryId, category);

            updateRequest.success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject("Unable to save the category. Server returned - "
                    + data.status
                    + " - "
                    + data.statusText);
            });

            return deferred.promise;
        };

        var _deleteCategory = function (categoryId) {
            var deferred = $q.defer();
            deferred.notify("Deleting...");
            var deleteRequest = $http.delete('/api/Category/' + categoryId);

            deleteRequest.success(function (data) {
                deferred.resolve(true);
            }).error(function (data) {
                deferred.reject("Unable to save the category. Server returned - "
                    + data.status
                    + " - "
                    + data.statusText);
            });

            return deferred.promise;
        };


        return {
            GetCategoryById: _getCategoryById,
            GetCategories: _getCategories,
            SaveCategory: _saveCategory,
            UpdateCategory: _updateCategory,
            DeleteCategory: _deleteCategory
        };


    };
    app.factory('categoryService', categoryService);
}
)(angular.module('app'));