using System;
using Forum.Lib.DataModel;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.IO;
using System.Linq;

namespace Forum.Lib.DataStore
{
    public class JsonDataStore : IDataStore, IDisposable
    {
        private IList<Category> forumCategory = null; // new List<Category>();
        private readonly string jsonStoreFilePath = null;
        public JsonDataStore(string filePath)
        {
            this.jsonStoreFilePath = filePath;
            if (File.Exists(jsonStoreFilePath))
            {
                var forumCategoryString = File.ReadAllText(jsonStoreFilePath);
                forumCategory = JsonConvert.DeserializeObject<List<Category>>(forumCategoryString);
            }

            if (forumCategory == null)
                forumCategory = new List<Category>();
        }

        public Category AddCategory(Category c)
        {
            if (forumCategory.Count == 0)
                c.Id = 1;
            else
                c.Id = forumCategory.Max(fc => fc.Id) + 1;

            forumCategory.Add(c);

            File.WriteAllText(jsonStoreFilePath, JsonConvert.SerializeObject(forumCategory));

            return c;
        }

        public ForumDetail AddForum(int categoryId, ForumDetail f)
        {
            var categoryFound = forumCategory.FirstOrDefault(c => c.Id == categoryId);

            if (categoryFound != null)
            {
                f.Id = getAvailableForumsCount() + 1;

                categoryFound.Forums.Add(f);

                File.WriteAllText(jsonStoreFilePath, JsonConvert.SerializeObject(forumCategory));
            }
            return f;
        }

        private int getAvailableForumsCount()
        {
            return forumCategory.Sum(c => c.Forums.Count);
        }


        public bool DeleteCategory(int id)
        {
            var categoryToRemove = forumCategory.FirstOrDefault(c => c.Id == id);
            if (categoryToRemove != null)
                forumCategory.Remove(categoryToRemove);

            return true;
        }

        public void Dispose()
        {
            try
            {
                File.WriteAllText(jsonStoreFilePath, JsonConvert.SerializeObject(forumCategory));
            }
            catch { }
        }

        public IList<Category> GetForumCategories()
        {
            return forumCategory;
        }

        public Category GetForumCategory(int cagtegoryID)
        {
            return forumCategory.FirstOrDefault(p => p.Id == cagtegoryID);
        }

        public bool RemoveForumFromCategory(int forumID)
        {
            var categoryFound = forumCategory.FirstOrDefault(c => c.Forums.FirstOrDefault(f => f.Id == forumID) != null); //forumCategory.FirstOrDefault(c => c.Id == categoryId);

            if (categoryFound != null)
            {
                var forumFound = categoryFound.Forums.FirstOrDefault(f => f.Id == forumID);
                categoryFound.Forums.Remove(forumFound);

                File.WriteAllText(jsonStoreFilePath, JsonConvert.SerializeObject(forumCategory));
            }
            return true;
        }

        public bool UpdateCategoryInfo(Category modifiedCategoryInfo)
        {

            var categoryFound = forumCategory.FirstOrDefault(c => c.Id == modifiedCategoryInfo.Id);

            if (categoryFound != null)
            {
                categoryFound.Name = modifiedCategoryInfo.Name;
                categoryFound.Description = modifiedCategoryInfo.Description;

                File.WriteAllText(jsonStoreFilePath, JsonConvert.SerializeObject(forumCategory));
            }
            return true;
        }

        public bool UpdateForumInfo(int categoryId, ForumDetail f)
        {
            var categoryFound = forumCategory.FirstOrDefault(c => c.Id == categoryId);

            if (categoryFound != null)
            {
                var forumFound = categoryFound.Forums.FirstOrDefault(frm => frm.Id == f.Id);
                forumFound.Title = f.Title;
                forumFound.Content = f.Content;

                File.WriteAllText(jsonStoreFilePath, JsonConvert.SerializeObject(forumCategory));
            }
            return true;
        }
    }
}