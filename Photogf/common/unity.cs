using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
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
        public static string MD5(string str)
        {
            MD5CryptoServiceProvider md5Hasher = new MD5CryptoServiceProvider();
            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(str));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2") + "1");
            }
            return sBuilder.ToString();
        }
    }
}