using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using Newtonsoft;
using Newtonsoft.Json;
using Photogf.Models;
using System.IO;
using Qiniu;
using Qiniu.Storage;
using Qiniu.Util;
using Qiniu.Http;

namespace Photogf.Controllers
{
    public class ajaxController : Controller
    {
        [HttpPost]
        public string Login(string UserName, string Password)
        {
            if (string.IsNullOrEmpty(UserName) || string.IsNullOrEmpty(Password))
                return "0";
            Entities dbHelper = new Entities();
            var user = dbHelper.Manager.FirstOrDefault(db => db.userName == UserName);
            if (user == null)
                return "0";
            if (user.password != common.unity.MD5(Password))
                return "0";
            Session["Login"] = user;
            return "1";
        }
        [Power]
        [HttpPost]
        public string ModifyPwd(string OldPwd, string NewPwd1, string NewPwd2)
        {
            if (string.IsNullOrEmpty(OldPwd) || OldPwd.Length < 6)
            {
                return "0";
            }
            if (string.IsNullOrEmpty(NewPwd1) || OldPwd.Length < 6)
            {
                return "0";
            }
            if (NewPwd1 != NewPwd2)
            {
                return "0";
            }
            Manager user = (Manager)Session["Login"];
            if (user.password != common.unity.MD5(OldPwd))
            {
                return "0";
            }
            Entities entities = new Entities();
            var modifyUser = entities.Manager.FirstOrDefault(db => db.userName == user.userName);
            modifyUser.password = common.unity.MD5(NewPwd1);
            entities.SaveChanges();
            Session.Clear();
            return "1";
        }
        [HttpPost]
        [Power]
        public string UpdataIndexVideo(string path)
        {
            if (string.IsNullOrEmpty(path))
                return "0";
            //Regex re = new Regex(@"^.*\.mp4$");
            //if (re.IsMatch(path))
            //    return "0";
            Entities dbHelper = new Entities();
            var model = dbHelper.fileManager.FirstOrDefault(db => db.fileType == "0");
            if (model == null)
            {
                fileManager fp = new fileManager()
                {
                    addTime = DateTime.Now,
                    fileName = "Index Page Movie",
                    fileContent = "This is a Index Page Movie of ChuXiang!!!",
                    filePath = path,
                    fileTitle = "Index Page Movie",
                    fileType = "0",
                    productID = 0
                };
                dbHelper.fileManager.Add(fp);
            }
            else
            {
                model.filePath = path;
            }
            dbHelper.SaveChanges();
            return "1";
        }

        /// <summary>
        /// 获取所有项目
        /// </summary>
        /// <param name="productTypeID"></param>
        /// <returns></returns>
        [HttpPost]
        public string GetAllProduct(int productTypeID)
        {
            Entities dbHelper = new Entities();
            var productList = dbHelper.product.ToList();
            if (productTypeID != -1)
            {
                productList = productList.Where(db => db.productTypeID == productTypeID).ToList();
            }
            List<ResponseModel.filelistModel> list = new List<ResponseModel.filelistModel>();
            foreach (var item in productList)
            {
                ResponseModel.filelistModel reson = new ResponseModel.filelistModel();
                reson.Title = item.productTitle;
                reson.list = dbHelper.fileManager.Where(db => db.productID == item.id).ToList();
                list.Add(reson);
            }
            return JsonConvert.SerializeObject(list);
        }
        [HttpPost]
        public string GetProduct(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.product.FirstOrDefault(db => db.id == id);
            if (model != null)
                return JsonConvert.SerializeObject(model);
            return "";
        }

        [HttpPost]
        public string GetItemType(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.productType.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "";
            return JsonConvert.SerializeObject(model);
        }
        /// <summary>
        /// 添加分类
        /// </summary>
        /// <param name="productName"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        [HttpPost]
        [Power]
        public string AddItemTypes(string productName, string content)
        {
            Entities dbHelper = new Entities();
            productType model = new productType()
            {
                productName = productName,
                productContent = content
            };
            dbHelper.productType.Add(model);
            dbHelper.SaveChanges();
            return "1";
        }
        [HttpPost]
        [Power]
        public string EditItemTypes(int id, string productName, string content)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.productType.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "ItemType Not Find!";
            model.productName = productName;
            model.productContent = content;
            dbHelper.SaveChanges();
            return "1";
        }

        [HttpPost]
        public string GetProductType()
        {
            Entities dbHelper = new Entities();
            var reson = new List<ResponseModel.NameValue>();
            var list = dbHelper.productType.ToList();
            foreach (var item in list)
            {
                reson.Add(new ResponseModel.NameValue(item.productName, item.id.ToString()));
            }
            return JsonConvert.SerializeObject(reson);
        }
        [HttpPost]
        [Power]
        public string AddProduct(string itemName, int proID, string proIntroduce, string proContent)
        {
            proContent = HttpUtility.UrlDecode(proContent);
            Entities dbHelper = new Entities();
            product model = new product()
            {
                productTitle = itemName,
                productContent = proContent,
                productIntroduce = proIntroduce,
                productTypeID = proID
            };
            dbHelper.product.Add(model);
            dbHelper.SaveChanges();
            return "1";
        }
        [Power]
        [HttpPost]
        public string EditProduct(int id, string itemName, int proID, string proIntroduce, string proContent)
        {
            proContent = HttpUtility.UrlDecode(proContent);
            Entities dbHelper = new Entities();
            var model = dbHelper.product.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "0";
            model.productTitle = itemName;
            model.productTypeID = proID;
            model.productIntroduce = proIntroduce;
            model.productContent = proContent;
            dbHelper.SaveChanges();
            return "1";
        }

        [HttpPost]
        public string GetProductListByType(int productTypeID)
        {
            Entities dbHelper = new Entities();
            var list = dbHelper.product.ToList();
            if (productTypeID != 0)
                list = list.Where(db => db.productTypeID == productTypeID).ToList();
            return JsonConvert.SerializeObject(list);
        }
        [HttpPost]
        [Power]
        public string DelProduct(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.product.FirstOrDefault(db => db.id == id);
            if (model != null)
            {
                dbHelper.product.Remove(model);
                dbHelper.SaveChanges();
            }
            return "";
        }
        [HttpPost]
        [Power]
        public string DelItemType(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.productType.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "The ItemType Is Not Find";
            var pdc = dbHelper.product.FirstOrDefault(db => db.productTypeID == id);
            if (pdc != null)
                return "Have Some Product In The ItemType,Delete Wrong~~";
            dbHelper.productType.Remove(model);
            dbHelper.SaveChanges();
            return "1";
        }
        #region qiniuyun
        [HttpPost]
        [Power]
        public string UpLoadByQiniu()
        {
            Regex regex = new Regex(@"^.*\.(jpg|png|jpeg|gif|bmp)$");

            var fileData = Request.Files;
            if (fileData.Count == 0)
                return "";
            var f1 = fileData[0];
            if (!regex.IsMatch(f1.FileName))
            {
                return "";
            }
            string bucket = "cxsy";
            string AK = "FidaIy47-FKN_aFd4CTkloFWlT5ZOpZLvZdiiJ-0";
            string SK = "l3t9yZdGdQnQXo0O6n8XUGPxlqPqde38M0VIWZ5Y";
            Mac mac = new Mac(AK, SK);
            Auth auth = new Auth(mac);

            Config con = new Config();
            Zone zone = ZoneHelper.QueryZone(AK, bucket);
            PutPolicy putPolicy = new PutPolicy();
            putPolicy.Scope = bucket;
            putPolicy.SetExpires(3600);
            string jstr = putPolicy.ToJsonString();
            string token = Auth.CreateUploadToken(mac, jstr);
            FormUploader fu = new FormUploader(con);
            string saveKey = $"{Guid.NewGuid()}.{f1.FileName.Split('.')[f1.FileName.Split('.').Length - 1]}";
            Stream data = f1.InputStream;
            PutExtra pe = new PutExtra();
            HttpResult result = fu.UploadStream(data, saveKey, token, pe);
            con.Zone = zone;
            const string s = "http://p7bhbqmrr.bkt.clouddn.com/";
            return s + saveKey;
        }
        #endregion

        [HttpPost]
        [Power]
        public string Upload()
        {
            Regex regex = new Regex(@"^.*\.(jpg|png|jpeg|gif|bmp)$");

            var fileData = Request.Files;
            if (fileData.Count == 0)
                return "";
            var f1 = fileData[0];
            if (!regex.IsMatch(f1.FileName))
            {
                return "";
            }
            if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath("/upload")))
            {
                Directory.CreateDirectory(System.Web.HttpContext.Current.Server.MapPath("/upload"));
            }
            string fnamepath = $"{Guid.NewGuid()}.{f1.FileName.Split('.')[f1.FileName.Split('.').Length - 1]}";
            f1.SaveAs($"{System.Web.HttpContext.Current.Server.MapPath("/upload")}/{fnamepath}");
            return $"/upload/{fnamepath}";
        }
        [HttpPost]
        [Power]
        public string UploadFile(string filePathBz, string fileTitle, string fileContent, string fileType, int productID)
        {
            fileContent = HttpUtility.UrlDecode(fileContent);
            Entities dbHelper = new Entities();
            fileManager model = new fileManager()
            {
                addTime = DateTime.Now,
                fileContent = fileContent,
                fileName = fileTitle,
                fileTitle = fileTitle,
                filePath = filePathBz,
                fileType = fileType,
                productID = productID
            };
            dbHelper.fileManager.Add(model);
            dbHelper.SaveChanges();
            return "1";
        }
        [HttpPost]
        [Power]
        public string DelFiles(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.fileManager.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "不存在该资源";
            dbHelper.fileManager.Remove(model);
            dbHelper.SaveChanges();
            return "1";
        }
        [HttpPost]
        [Power]
        public string AddNews(string Title, string content)
        {
            content = HttpUtility.UrlDecode(content);
            Entities dbHelper = new Entities();
            dbHelper.News.Add(new News()
            {
                Author = "admin",
                Content = content,
                LastTime = DateTime.Now.ToString("yyyy-MM-dd"),
                Title = Title
            });
            dbHelper.SaveChanges();
            return "1";
        }
        [HttpPost]
        [Power]
        public string EditNews(int id, string Title, string content)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.News.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "Not Found The News";
            model.Title = Title;
            model.Content = content;
            model.LastTime = DateTime.Now.ToString("yyyy-MM-dd");
            dbHelper.SaveChanges();
            return "1";
        }
        [HttpPost]
        [Power]
        public string RemoveNews(int id)
        {
            Entities dbHelper = new Entities();
            var model = dbHelper.News.FirstOrDefault(db => db.id == id);
            if (model == null)
                return "Not Found The News";
            dbHelper.News.Remove(model);
            dbHelper.SaveChanges();
            return "1";
        }

        #region web
        public string GetTopNVideoByProductType(int productTypeID, int num)
        {
            Entities dbHelper = new Entities();
            List<ResponseModel.IndexResonModel> list = new List<ResponseModel.IndexResonModel>();
            List<product> fl = new List<product>();
            if (productTypeID != 0)
            {
                if (num != 0)
                    fl = dbHelper.product.OrderByDescending(db => db.id).Where(db => db.productTypeID == productTypeID).Take(num).ToList();
                else
                    fl = dbHelper.product.OrderByDescending(db => db.id).Where(db => db.productTypeID == productTypeID).ToList();
            }
            else
            {
                if (num != 0)
                    fl = dbHelper.product.OrderByDescending(db => db.id).Take(num).ToList();
                else
                    fl = dbHelper.product.OrderByDescending(db => db.id).ToList();
            }

            foreach (var item in fl)
            {
                ResponseModel.IndexResonModel model = new ResponseModel.IndexResonModel();
                model.id = item.id;
                var f = dbHelper.fileManager.FirstOrDefault(db => db.productID == item.id && db.fileType == "1");
                model.imgUrl = f?.filePath;
                model.Introduct = item.productIntroduce;
                model.Title = item.productTitle;
                list.Add(model);
            }
            return JsonConvert.SerializeObject(list);
        }
        #endregion

        [Power]
        [HttpPost]
        public string AddLink(string title, string link)
        {
            Entities dbHelper = new Entities();
            frendLink fLinkModel = dbHelper.frendLink.OrderByDescending(db => db.Sort).FirstOrDefault();
            int upID = 0;
            int sort = 1;
            if (fLinkModel != null)
            {
                upID = fLinkModel.ID;
                sort = fLinkModel.Sort + 1;
            }
            frendLink newFrendLinkModel = new frendLink()
            {
                Link = link,
                Title = title,
                UpID = upID,
                Sort = sort,
                DownID = 999
            };
            dbHelper.frendLink.Add(newFrendLinkModel);
            dbHelper.SaveChanges();
            if (fLinkModel != null)
            {
                fLinkModel.DownID = newFrendLinkModel.ID;
                dbHelper.SaveChanges();
            }
            return "1";
        }
        [Power]
        [HttpPost]
        public string RemoveOrChangeSort(int status, int id)
        {
            Entities dbHelper = new Entities();
            frendLink frendLinkModel = dbHelper.frendLink.FirstOrDefault(db => db.ID == id);
            if (frendLinkModel == null)
                return "0";
            frendLink UpFModel = dbHelper.frendLink.FirstOrDefault(db => db.DownID == id);
            frendLink DownFModel = dbHelper.frendLink.FirstOrDefault(db => db.UpID == id);
            if (status == 2)
            {
                if (UpFModel != null)
                {
                    UpFModel.DownID = frendLinkModel.DownID;
                }
                if (DownFModel != null)
                {
                    DownFModel.UpID = frendLinkModel.UpID;
                }
                dbHelper.frendLink.Remove(frendLinkModel);
                dbHelper.SaveChanges();
                return "1";
            }
            if (status == 0)
            {
                if (UpFModel != null)
                {
                    string title = frendLinkModel.Title;
                    string link = frendLinkModel.Link;
                    frendLinkModel.Title = UpFModel.Title;
                    frendLinkModel.Link = UpFModel.Link;
                    UpFModel.Title = title;
                    UpFModel.Link = link;
                    dbHelper.SaveChanges();
                    return "1";
                }
            }
            if (status == 1)
            {
                if (DownFModel != null)
                {
                    string title = frendLinkModel.Title;
                    string link = frendLinkModel.Link;
                    frendLinkModel.Title = DownFModel.Title;
                    frendLinkModel.Link = DownFModel.Link;
                    DownFModel.Title = title;
                    DownFModel.Link = link;
                    dbHelper.SaveChanges();
                    return "1";
                }
            }
            return "0";

        }

        [HttpPost]
        public string GetFrendLinkList()
        {
            Entities dbHelper = new Entities();
            List<frendLink> frendLinkList = dbHelper.frendLink.OrderBy(db=>db.Sort).ToList();
            return JsonConvert.SerializeObject(frendLinkList);
        }
    }
}