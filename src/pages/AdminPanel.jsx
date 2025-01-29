import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BlogEditor from "../components/BlogEditor";

const AdminPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });

      if (error) throw new Error("Error fetching blogs: " + error.message);

      setBlogs(data); // Update state with new blogs
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs on component mount
  }, []);

  const handleDelete = async (blogId) => {
    try {
      const { error } = await supabase.from("blogs").delete().eq("id", blogId);
      if (error) throw new Error("Error deleting blog: " + error.message);
  
      console.log("Blog deleted successfully!");
      fetchBlogs(); // Re-fetch blogs list
    } catch (error) {
      console.error(error.message);
    }
  };
  

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsEditing(true); // Trigger edit mode
  };

  const handleSuccess = () => {
    setEditingBlog(null);
    setIsEditing(false); // Exit edit mode
    const fetchBlogs = async () => {
      const { data, error } = await supabase.from("blogs").select("*");
      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data);
      }
    };
    fetchBlogs();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-darkGrey p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Admin Panel
        </h1>

        <div className="mb-8">
          {isEditing ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Editing Blog: {editingBlog?.title}
              </h2>
              <BlogEditor
                onSuccess={handleSuccess}
                blog={editingBlog}
                resetEditing={() => {
                  setIsEditing(false);
                  setEditingBlog(null);
                }}
              />
            </div>
          ) : (
            <BlogEditor onSuccess={handleSuccess} />
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
            Manage Blogs
          </h2>
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {blog.title}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {blogs.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              No blogs available. Start adding new blogs!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
