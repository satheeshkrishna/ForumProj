using Forum.Lib.DataModel;
using Forum.Lib.DataStore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Http;

namespace Forum.Controllers
{
    //[Route("api/category")]
    public class CategoryController : ApiController
    {
        private IDataStore dataStore = new JsonDataStore(
            Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "dataStore.json"));
        //get all categoryObj
        [HttpGet]
        public IEnumerable<Category> Get()
        {
            return dataStore.GetForumCategories();
        }

        //get categoryObj by id
        public Category Get(int id)
        {
            Category categoryObj = dataStore.GetForumCategory(id);
            if (categoryObj == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            return categoryObj;
        }

        //insert categoryObj
        public HttpResponseMessage Post(Category categoryObj)
        {
            if (ModelState.IsValid)
            {  

                dataStore.AddCategory(categoryObj);

                HttpResponseMessage response = Request.CreateResponse(
                    HttpStatusCode.Created, categoryObj);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = categoryObj.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        //update categoryObj
        public HttpResponseMessage Put(int id, Category categoryObj)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            if (id != categoryObj.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            try
            {
                dataStore.UpdateCategoryInfo(categoryObj);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        //delete categoryObj by id
        public HttpResponseMessage Delete(int id)
        {
            Category categoryObj = dataStore.GetForumCategory(id);
            if (categoryObj == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            try
            {
                dataStore.DeleteCategory(id);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }
            return Request.CreateResponse(HttpStatusCode.OK, categoryObj);
        }

        //prevent memory leak
        protected override void Dispose(bool disposing)
        {
            (dataStore as IDisposable).Dispose();
            base.Dispose(disposing);
        }
    }
}
