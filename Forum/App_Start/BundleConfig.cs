using System.Web;
using System.Web.Optimization;

namespace Forum
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/ui-bootstrap-tpls-2.5.0.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/assets/css/app.css"));

            bundles.Add(new ScriptBundle("~/Content/angular").Include(
                      "~/Scripts/angular.js",
                      "~/Scripts/angular-route.js"));


            bundles.Add(new ScriptBundle("~/Content/angularApp").Include(
                "~/app/directives/paginator.js",
                "~/app/app.module.js",
                      "~/app/app.routes.js"
                      /*, "~/app/app.translations.js"*/));
        }
    }
}
