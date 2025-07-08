using System.Web.Http;
using System.Web.Http.Cors;

namespace LegacyShop
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Legacy CORS configuration - not secure
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            // Web API routes - basic configuration
            config.MapHttpAttributeRoutes();

            // Default route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Remove XML formatter - JSON only (legacy approach)
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            
            // Basic JSON configuration
            config.Formatters.JsonFormatter.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
            config.Formatters.JsonFormatter.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        }
    }
}