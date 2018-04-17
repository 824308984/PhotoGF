using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Photogf.common
{
    public static class unity
    {
        public static Int64 GetTime()
        {
            var s = Int64.Parse(Math.Round((DateTime.Now - Convert.ToDateTime("1970-1-1")).TotalSeconds, 0).ToString());
            return s;
        }
    }
}