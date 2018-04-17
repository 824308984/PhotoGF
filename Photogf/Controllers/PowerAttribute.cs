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
            if (string.IsNullOrEmpty(AppSetting.token))
                filterContext.Result = new RedirectResult("/Admin/Login");
            Regex r = new Regex(@"^\d{10,10}$");
            if (!r.IsMatch(AppSetting.token))
                filterContext.Result = new RedirectResult("/Admin/Login");
            if (int.Parse(AppSetting.token) == 0)
                filterContext.Result = new RedirectResult("/Admin/Login");
            var host = filterContext.RequestContext.HttpContext.Request.UserHostAddress;
            if (host != AppSetting.host)
                filterContext.Result = new RedirectResult("/Admin/Login");
            long t = Int64.Parse(AppSetting.token);
            if ((t - common.unity.GetTime()) >= 60 * 60 * 3)
                filterContext.Result = new RedirectResult("/Admin/Login");
        }
    }
}