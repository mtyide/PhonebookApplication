using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace PhonebookApplication
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            configuration.Routes.MapHttpRoute(name: "DefaultApi", routeTemplate: "api/{controller}/{id}", defaults: new { id = RouteParameter.Optional });
            configuration.Routes.MapHttpRoute(name: "ApiWithActionAndName", routeTemplate: "api/{controller}/{action}/{name}", defaults: null, constraints: new { id = @"^[a-z]+$" });
            configuration.Routes.MapHttpRoute(name: "ApiWithAction", routeTemplate: "api/{controller}/{action}", defaults: null, constraints: null);
        }
    }
}
