(
    function(app) {
        'use strict';

        //create angularjs controller
        //var app = ;//set and get the angular module
        //angularjs controller method
        function categoryController($scope, $http, $routeParams, $q, categoryService) {

            //declare variable for mainain ajax load and entry or edit mode
            $scope.categories = [];
            $scope.loading = true;
            $scope.addMode = false;
            $scope.isInfoAvailable = function() { return $scope.information && $scope.information.length > 0; }
            $scope.categoryToDelete = null;
            $scope.canShowDeleteCategoryWarning = function() {
                return ($scope.categoryToDelete && $scope.categoryToDelete != null
                    && $scope.categoryToDelete.Forums.length > 0);
            }

            var getCategoryPromise = categoryService.GetCategories();


            getCategoryPromise.then(function(categoriesFromServer) {
                $scope.categories =
                    $scope.categoriesMasterCopy = categoriesFromServer.data;
                $scope.filterRowsByPageSize();
                $scope.loading = false;

            }, function(requestFailedReason) {
                __handleError(requestFailedReason);
            }, function(updateInfo) {
                __handleNotification(updateInfo);
            });

            var __handleError = function(errorMsg) {
                $scope.error = errorMsg;
                $scope.information = "";
                $scope.loading = false;
            }

            var __handleNotification = function(notification) {
                $scope.error = "";
                $scope.information = notification;
            }



            //by pressing toggleEdit button ng-click in html, this method will be hit
            $scope.toggleEdit = function() {
                this.category.editMode = !this.category.editMode;
            };

            //by pressing toggleAdd button ng-click in html, this method will be hit
            $scope.toggleAdd = function() {
                $scope.addMode = !$scope.addMode;
                $scope.newCategory = {};
                $scope.newCategory.Id = 0;
                $scope.newCategory.Name = '';
                $scope.newCategory.Description = '';
            };

            //Inser Category
            $scope.add = function() {
                $scope.loading = true;

                var saveRequestPromise = categoryService.SaveCategory(this.newCategory);

                saveRequestPromise.then(
                    function(dataFromServer) {
                        $scope.information = "Added Successfully!!";
                        $scope.addMode = false;
                        $scope.categories.push(dataFromServer);
                        $scope.loading = false;
                    },
                    function(saveFailedReason) {
                        __handleError("An Error has occured while adding Category! " + " " + saveFailedReason);
                    },
                    function(saveInfo) {
                        __handleNotification(saveInfo);
                    }
                );
            };

            //Edit Category
            $scope.save = function() {
                $scope.loading = true;
                var categoryToEdit = this.category;

                var updateRequestPromise = categoryService.UpdateCategory(categoryToEdit.Id, categoryToEdit);

                updateRequestPromise.then(
                    function(dataFromServer) {
                        $scope.error = "Updated Successfully!!";
                        categoryToEdit.editMode = false;
                        $scope.loading = false;
                    },
                    function(updateFailedReason) {
                        __handleError("An Error has occured while updating Category! " + " " + updateFailedReason);
                    },
                    function(updateInfo) {
                        __handleNotification(updateInfo);
                    }
                );
            };


            $scope.warnDeleteCategory = function(category) {
                $scope.categoryToDelete = category;

                if (category.Forums.length == 0) {
                    this.deleteCategory();
                }
            }

            $scope.cancelDelete = function() {
                $scope.categoryToDelete = null;
            }

            //Delete Category
            $scope.deleteCategory = function() {

                if (!($scope.categoryToDelete))
                    return;

                $scope.loading = true;

                var Id = $scope.categoryToDelete.Id;

                var deleteRequestPromise = categoryService.DeleteCategory(Id);

                deleteRequestPromise.then(
                    function(dataFromServer) {
                        if (dataFromServer) {
                            $scope.categoryToDelete = null;
                            $scope.loading = false;
                            $scope.error = "Deleted successfully."
                            $.each($scope.categories, function(i) {
                                if ($scope.categories[i].Id === Id) {
                                    $scope.categories.splice(i, 1);
                                    return false;
                                }
                            });
                        }
                    },
                    function(updateFailedReason) {
                        __handleError("An Error has occured while Saving Category! " + updateFailedReason);
                        $scope.categoryToDelete = null;
                    },
                    function(updateInfo) {
                        __handleNotification(updateInfo);
                    }
                );
            };


            /*Pagination stuff - starts*/
            $scope.currentPage = 1;
            $scope.maxPageIndicators = 6;
            $scope.numberOfRowsPerPage = 2;

            $scope.filteredCategories = [];

            $scope.filterRowsByPageSize = function() {
                if ($scope.categories) {
                    var rowsTemp = $scope.numberOfRowsPerPage > 0 ? $scope.numberOfRowsPerPage : 1;
                    var begin = (($scope.currentPage - 1) * rowsTemp)
                        , end = begin + rowsTemp;

                    $scope.filteredCategories = $scope.categories.slice(begin, end);
                }
            }

            $scope.numberOfPagesAvailable = function() {
                if ($scope.categories)
                    return Math.ceil($scope.categories.length / ($scope.numberOfRowsPerPage));
                return 1;
            }

            $scope.totalAvailableRows = function() {
                if ($scope.categories)
                    return $scope.categories.length;
                return 0;
            }

            $scope.$watch('currentPage + numberOfRowsPerPage', function() {
                $scope.filterRowsByPageSize();
            });
            /*Pagination stuff - ends*/
        }

        categoryController.$inject = ["$scope", "$http", "$routeParams", "$q", "categoryService"];

        app.controller('categoryController',
            ['$scope', '$http', "$routeParams", "$q", "categoryService", categoryController])
            //.directive("mypaginator", function(websiteHostedName) {

            //    var RowsPerPage = 10;


            //    return {
            //        templateUrl: websiteHostedName + "app/directives/paginator.html",
            //        transclude: true,
            //        scope: true,
            //        link: linkFn
            //    };

            //    function linkFn(scope, element, attrs) {

            //        scope.$parent.PageNumbers = [];
            //        scope.PagesNumbersToShow = 5;
            //        scope.populatePageNumbers = function() {
            //            scope.$parent.PageNumbers = [];
            //            var totalPagesTemp = scope.totalPages();
            //            for (var i = 1; i <= totalPagesTemp; i++)
            //                scope.$parent.PageNumbers.push(i);
            //        }

            //        scope.totalPages = function() {
            //            return Math.ceil(scope.$parent.totalAvailableRows() / scope.$parent.numberOfRowsPerPage);
            //        }

            //        scope.setPage = function(no) {
            //            if (no > 0) {
            //                scope.$parent.currentPage = no;
            //            }
            //        }

            //        scope.setNextPage = function() {
            //            if (scope.$parent.currentPage < scope.totalPages()) {
            //                scope.$parent.currentPage = scope.$parent.currentPage + 1;
            //            }

            //        }
            //        scope.setPrevPage = function() {
            //            if (scope.$parent.currentPage > 1) {
            //                scope.$parent.currentPage = scope.$parent.currentPage - 1;
            //            }
            //        }
            //        scope.setLastPage = function() {

            //            scope.$parent.currentPage = scope.totalPages();

            //        }


            //    }
            //})
            ;

    })(angular.module('app'));