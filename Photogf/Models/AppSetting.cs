using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Configuration;

namespace Photogf.Models
{
    public static class AppSetting
    {
        public static string Admin = nameof(Admin).GetStringStrByWebConfig();
        public static string token = nameof(token).GetStringStrByWebConfig();
        public static string host = nameof(host).GetStringStrByWebConfig();

        public static string GetStringStrByWebConfig(this string key)
        {
            return ConfigurationManager.AppSettings[key].ToString();
        }
        public static void SetKeyValue(this string key, string val)
        {
            Configuration cfa = WebConfigurationManager.OpenWebConfiguration("~");
            cfa.AppSettings.Settings[key].Value = val;
            cfa.Save();
        }
    }
}