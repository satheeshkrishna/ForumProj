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
    public class ForumController : ApiController
    {
        private IDataStore dataStore = new JsonDataStore(
            Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "dataStore.json"));
        //get all categoryObj
        //[HttpGet]
        //public IEnumerable<Category> Get()
        //{
        //    return dataStore.GetForumCategories();
        //}


        public IEnumerable<ForumDetail> Get(int id)
        {
            Category categoryObj = dataStore.GetForumCategory(id);
            if (categoryObj == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            return categoryObj.Forums;
        }

        public ForumDetail Get(int id, int forumId)
        {
            Category categoryObj = dataStore.GetForumCategory(id);
            if (categoryObj == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            var forumMatch = categoryObj.Forums.FirstOrDefault(f => f.Id == forumId);
            if (forumMatch == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            return forumMatch;
        }

        //insert categoryObj
        public HttpResponseMessage Post(int id, ForumDetail forumInfo)
        {
            if (ModelState.IsValid)
            {
                var forumUpdated = dataStore.AddForum(id, forumInfo);

                HttpResponseMessage response = Request.CreateResponse(
                    HttpStatusCode.Created, forumUpdated);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = forumUpdated.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        //id: categoryID
        public HttpResponseMessage Put(int id, ForumDetail forumInfo)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            try
            {
                dataStore.UpdateForumInfo(id, forumInfo);
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
            try
            {
                dataStore.RemoveForumFromCategory(id);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        //prevent memory leak
        protected override void Dispose(bool disposing)
        {
            (dataStore as IDisposable).Dispose();
            base.Dispose(disposing);
        }
    }
}
