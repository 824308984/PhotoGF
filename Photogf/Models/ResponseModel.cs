using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Photogf.Models
{
    public class ResponseModel
    {
        public class NameValue
        {
            public string Name { get; set; }
            public string Value { get; set; }
            public NameValue() { }
            public NameValue(string _name, string _value)
            {
                Name = _name;
                Value = _value;
            }
        }
        public class filelistModel
        {
            public string Title { get; set; }
            public List<fileManager> list { get; set; }
        }
        public class IndexResonModel
        {
            public int id { get; set; }
            public string imgUrl { get; set; }
            public string Title { get; set; }
            public string Introduct { get; set; }
        }
    }
}