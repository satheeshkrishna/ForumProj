var mypaginator = function (websiteHostedName) {
    return {
        templateUrl: websiteHostedName + "app/directives/paginator.html",
        transclude: true,
        scope: true,
        link: linkFn
    };

    function linkFn(scope, element, attrs) {

        scope.PageNumbers = [];
        scope.PagesNumbersToShow = 5;
        scope.populatePageNumbers = function () {
            scope.PageNumbers = [];
            var totalPagesTemp = scope.totalPages();
            for (var i = 1; i <= totalPagesTemp; i++)
                scope.$parent.PageNumbers.push(i);
        }

        scope.totalPages = function () {
            return Math.ceil(scope.$parent.totalAvailableRows() / scope.$parent.numberOfRowsPerPage);
        }

        scope.setPage = function (no) {
            if (no > 0) {
                scope.$parent.currentPage = no;
            }
        }

        scope.setNextPage = function () {
            if (scope.$parent.currentPage < scope.totalPages()) {
                scope.$parent.currentPage = scope.$parent.currentPage + 1;
            }

        }
        scope.setPrevPage = function () {
            if (scope.$parent.currentPage > 1) {
                scope.$parent.currentPage = scope.$parent.currentPage - 1;
            }
        }
        scope.setLastPage = function () {

            scope.$parent.currentPage = scope.totalPages();

        }


    }

}