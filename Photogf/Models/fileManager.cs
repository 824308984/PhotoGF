//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Photogf.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class fileManager
    {
        public int id { get; set; }
        public string fileName { get; set; }
        public string filePath { get; set; }
        public string fileTitle { get; set; }
        public string fileContent { get; set; }
        public System.DateTime addTime { get; set; }
        public string fileType { get; set; }
        public int productID { get; set; }
    }
}
