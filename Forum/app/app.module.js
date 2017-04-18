(function () {
    var app = angular.module('app', [
        // Angular modules 
        'ngRoute'
        // Custom modules 

        // 3rd Party Modules
        , "ui.bootstrap"
    ]);

    //Keep this to '/' when you run in IIS express mode. Use the site name when you host the app in IIS
    var websiteHostedName = '/forum/';

    app.constant('apiURLBase', websiteHostedName + 'api');
    app.constant('websiteHostedName', websiteHostedName);

    app.config(
        function ($routeProvider) {
            $routeProvider
                .when("/forum/:id",
                {
                    controller: "forumController",
                    templateUrl: websiteHostedName + "app/components/forum/forumView.html"
                })
        });

    app.directive("mypaginator", mypaginator);


}
)();


