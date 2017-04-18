(
    function (app) {
        'use strict';

        //angularjs controller method
        function forumController($scope, $http, $routeParams, $q, $rootScope, categoryService, forumService) {
            var prevCategoryID;

            //pagination starts
            $scope.currentPage = 1;
            $scope.maxPageIndicators = 6;
            $scope.numberOfRowsPerPage = 2;

            $scope.filteredForums = [];

            $scope.totalAvailableRows = function () {
                if ($scope.category && $scope.category.Forums)
                    return $scope.category.Forums.length;
                return 0;
            }

            $scope.$watch('currentPage + numberOfRowsPerPage', function () {
                $scope.filterRowsByPageSize();
            });

            $scope.filterRowsByPageSize = function () {
                if ($scope.category && $scope.category.Forums) {
                    var rowsTemp = $scope.numberOfRowsPerPage > 0 ? $scope.numberOfRowsPerPage : 1;
                    var begin = (($scope.currentPage - 1) * rowsTemp)
                        , end = begin + rowsTemp;

                    $scope.filteredForums = $scope.category.Forums.slice(begin, end);
                }
            }

            $scope.paginationModel = {
                value: { $scope }
            };

            //pagination ends
            /*
            $scope.getCurrentView = function () {
                return $rootScope.currentView;
            }
            $scope.setCurrentView = function (viewName) {
                $rootScope.currentView = viewName;
            }

            $scope.setCurrentView("forum");
            $scope.canShowForumPanel = function ()
            {
                return $scope.getCurrentView() == "forum";
            }*/


            if ($routeParams.id) {
                prevCategoryID = $scope.categoryId;
                $scope.categoryId = $routeParams.id;
            }
            else {
                $scope.categoryId = 0;
                prevCategoryID = 0;
            }

            //declare variable for mainain ajax load and entry or edit mode
            $scope.loading = true;
            $scope.addMode = false;
            $scope.isInfoAvailable = function () { return $scope.information && $scope.information.length > 0; }
            $scope.categoryToDelete = null;
            $scope.canShowDeleteForumWarning = function () {
                return ($scope.categoryToDelete && $scope.categoryToDelete != null
                    && $scope.categoryToDelete.Forums.length > 0);
            }



            $scope.refreshForums = function () {
                if ($scope.categoryId && $scope.categoryId > 0) {

                    var getCategoryPromise = categoryService.GetCategoryById($scope.categoryId);


                    getCategoryPromise.then(function (categoryFromServer) {
                        $scope.category = categoryFromServer.data;
                        $scope.filterRowsByPageSize();
                        $scope.loading = false;
                    }, function (requestFailedReason) {
                        __handleError(requestFailedReason);
                    }, function (updateInfo) {
                        __handleNotification(updateInfo);
                    });
                }
            }


            var __handleError = function (errorMsg) {
                $scope.error = errorMsg;
                $scope.information = "";
                $scope.loading = false;
            }

            var __handleNotification = function (notification) {
                $scope.error = "";
                $scope.information = notification;
            }

            //by pressing toggleEdit button ng-click in html, this method will be hit
            $scope.toggleEdit = function (forum) {
                $scope.forumToEditMasterCopy = JSON.parse(JSON.stringify(forum));;
                $scope.forumToEdit = forum;
                $scope.forumToEdit.editMode = true;
            };

            $scope.canShowEditMode = function () {
                return $scope.forumToEdit && $scope.forumToEdit != null;
            }

            $scope.cancelEditForum = function () {
                var editID = $scope.forumToEdit.Id;


                $.each($scope.category.Forums, function (i) {
                    if ($scope.category.Forums[i].Id === editID) {
                        $scope.category.Forums[i].Title = $scope.forumToEditMasterCopy.Title;
                        $scope.category.Forums[i].Content = $scope.forumToEditMasterCopy.Content;
                        return false;
                    }
                });

                $scope.forumToEdit = null;
            }

            $scope.toggleDetails = function (forum) {
                $scope.detailsMode = !$scope.detailsMode;
                if ($scope.detailsMode)
                    $scope.ForumToView = forum;
                else
                    $scope.ForumToView = null;
            };

            //by pressing toggleAdd button ng-click in html, this method will be hit
            $scope.toggleAdd = function () {
                $scope.addMode = !$scope.addMode;
                $scope.newForum = {};
                $scope.newForum.Id = 0;
                $scope.newForum.Title = '';
                $scope.newForum.Content = '';
                $scope.newForum.categoryId = $scope.categoryId;
            };

            $scope.mode = function () {
                if ($scope.addMode)
                    return "Add";
                else if ($scope.canShowEditMode())
                    return "Edit";
                else if ($scope.detailsMode)
                    return "Details";
                else
                    return "List";
            }

            $scope.toggleListMode = function () {
                $scope.addMode =
                    $scope.detailsMode = false;
                $scope.forumToEdit = null;
            }

            //Inser forum
            $scope.add = function () {
                $scope.loading = true;

                //$scope.categoryId = $route.current.params.categoryId;

                var saveRequestPromise = forumService.SaveForum($scope.categoryId, this.newForum);

                saveRequestPromise.then(
                    function (dataFromServer) {
                        $scope.information = "Added Successfully!!";
                        $scope.addMode = false;
                        $scope.category.Forums.push(dataFromServer);
                        $scope.loading = false;
                    },
                    function (saveFailedReason) {
                        __handleError("An Error has occured while adding Forum..! " + " " + saveFailedReason);
                    },
                    function (saveInfo) {
                        __handleNotification(saveInfo);
                    }
                );
            };

            //Edit forum
            $scope.save = function () {
                $scope.loading = true;
                var forumToEdit = $scope.forumToEdit;

                var updateRequestPromise = forumService.UpdateForum($scope.category.Id, forumToEdit);

                updateRequestPromise.then(
                    function (dataFromServer) {
                        $scope.error = "Updated Successfully!!";
                        $scope.forumToEdit = null;
                        $scope.loading = false;
                    },
                    function (updateFailedReason) {
                        __handleError("An Error has occured while updating forum! " + " " + updateFailedReason);
                    },
                    function (updateInfo) {
                        __handleNotification(updateInfo);
                    }
                );
            };


            $scope.warnDeleteForum = function (categoryId, forum) {
                $scope.forumToDelete = forum;
                this.deleteForum();
            }

            $scope.cancelDelete = function () {
                $scope.forumToDelete = null;
            }

            //Delete forum
            $scope.deleteForum = function () {

                if (!($scope.forumToDelete))
                    return;

                $scope.loading = true;

                var deleteRequestPromise = forumService.DeleteForum($scope.forumToDelete.Id);

                deleteRequestPromise.then(
                    function (dataFromServer) {
                        if (dataFromServer) {
                            $scope.loading = false;
                            $scope.error = "Deleted successfully."
                            $.each($scope.category.Forums, function (i) {
                                if ($scope.category.Forums[i].Id === $scope.forumToDelete.Id) {
                                    $scope.category.Forums.splice(i, 1);
                                    return false;
                                }
                            });

                            $scope.forumToDelete = null;
                        }
                    },
                    function (updateFailedReason) {
                        __handleError("An Error has occured while Saving forum! " + updateFailedReason);
                        $scope.forumToDelete = null;
                    },
                    function (updateInfo) {
                        __handleNotification(updateInfo);
                    }
                );
            };


            $scope.forumsExists = function () {
                return $scope.category && $scope.category.Forums.length > 0;
            }
            $scope.isCategorySeleted = function () {
                return $scope.category && $scope.category.Id > 0;
            }

            //if (prevCategoryID != $scope.categoryId)
            $scope.refreshForums();

            $scope.loading = false;
        }

        forumController.$inject = ["$scope", "$http", "$routeParams", "$q", "$rootScope", "categoryService", "forumService"];

        app.controller('forumController',
            ['$scope', '$http', "$routeParams", "$q", "$rootScope", "categoryService", "forumService",
                forumController]);



    })(angular.module('app'));