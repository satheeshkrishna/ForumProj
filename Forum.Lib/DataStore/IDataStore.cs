using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Forum.Lib.DataModel;

namespace Forum.Lib.DataStore
{
    public interface IDataStore
    {
        Category AddCategory(Category c);
        ForumDetail AddForum(int categoryID, ForumDetail f);

        bool DeleteCategory(int id);
        bool RemoveForumFromCategory(int forumID);

        bool UpdateCategoryInfo(Category modifiedCategoryInfo);
        bool UpdateForumInfo(int categoryID, ForumDetail f);
        IList<Category> GetForumCategories();
        Category GetForumCategory(int cagtegoryID);
    }
}
