using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Photogf.Models;

namespace Photogf.Controllers
{
    public class PhotoGFController : Controller
    {
        // GET: PhotoGF
        public ActionResult Index()
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.fileManager.FirstOrDefault(db => db.productID == 0);
            string fp = "";
            if (model != null)
                fp = model.filePath;
            ViewBag.filePath = fp;
            return View();
        }
        public ActionResult About()
        {
            return View();
        }

        public ActionResult Portfolio()
        {
            return View();
        }
        public ActionResult Details(int id)
        {
            Entities dbHelper = new Entities();
            var flist = dbHelper.fileManager.Where(db => db.productID == id);
            var f = flist.FirstOrDefault(db => db.fileType == "2");
            var f2 = flist.Where(db => db.fileType == "1").ToList();
            string fp = "";
            if (f != null)
                fp = f.filePath;
            ViewBag.Video = fp;
            ViewBag.Imgs = f2;
            var pd = dbHelper.product.FirstOrDefault(db => db.id == id);
            if (pd == null)
                RedirectToAction(nameof(Portfolio));
            ViewBag.Product = pd;
            return View();
        }
        public ActionResult Contact()
        {
            return View();
        }

        public ActionResult NewsList(string id)
        {
            int index = 1;
            if (!string.IsNullOrEmpty(id))
                int.TryParse(id, out index);
            if (index < 1)
                index = 1;
            ViewBag.Index = index;

            Entities dbHelper = new Entities();
            var list = dbHelper.News.OrderByDescending(db => db.LastTime).Skip(index * 10 - 10).Take(10).ToList();
            ViewBag.Count = dbHelper.News.Count();
            ViewBag.NewsList = list;
            return View();
        }
        public ActionResult NewsDetail(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.News.FirstOrDefault(db => db.id == id);
            if (model == null)
                RedirectToAction(nameof(NewsList));
            ViewBag.News = model;
            return View();
        }
    }
}