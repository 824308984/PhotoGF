using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Photogf.Models;

namespace Photogf.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Login()
        {
            return View();
        }
        [Power]
        public ActionResult Index()
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.fileManager.FirstOrDefault(db => db.fileType == "0");
            ViewBag.model = model;
            return View();
        }
        [Power]
        public ActionResult AddItem()
        {
            return View();
        }
        [Power]
        public ActionResult EditItem()
        {
            return View();
        }
        [Power]
        public ActionResult EditItemType()
        {
            return View();
        }
        [Power]
        public ActionResult fileList()
        {
            return View();
        }
        [Power]
        public ActionResult fileUploadPage()
        {
            return View();
        }
        [Power]
        public ActionResult ItemList()
        {
            return View();
        }
        [Power]
        public ActionResult ProductType()
        {
            return View();
        }
        [Power]
        public ActionResult AddItemType()
        {
            return View();
        }
        [Power]
        public ActionResult NewsManager()
        {
            Entities dbHelper = new Entities();
            var list = dbHelper.News.OrderByDescending(db => db.LastTime).ToList();
            ViewBag.NewsList = list;
            return View();
        }
        [Power]
        public ActionResult AddNews()
        {
            return View();
        }
        [Power]
        public ActionResult EditNews(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.News.FirstOrDefault(db => db.id == id);
            if (model == null)
                RedirectToAction("NewsManager");
            ViewBag.model = model;
            return View();
        }
        [Power]
        public ActionResult ShowNews(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.News.FirstOrDefault(db => db.id == id);
            if (model == null)
                RedirectToAction("NewsManager");
            ViewBag.model = model;
            return View();
        }
    }
}