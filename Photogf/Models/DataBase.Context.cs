﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class Entities : DbContext
    {
        public Entities()
            : base("name=Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<fileManager> fileManager { get; set; }
        public virtual DbSet<Manager> Manager { get; set; }
        public virtual DbSet<product> product { get; set; }
        public virtual DbSet<productType> productType { get; set; }
        public virtual DbSet<News> News { get; set; }
        public virtual DbSet<frendLink> frendLink { get; set; }
    }
}
