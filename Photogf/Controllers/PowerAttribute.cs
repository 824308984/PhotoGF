using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using Photogf.Models;

namespace Photogf.Controllers
{
    public class PowerAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            var user = HttpContext.Current.Session["Login"];
            if (user == null)
                filterContext.Result = new RedirectResult("/Admin/Login");
        }
    }
}