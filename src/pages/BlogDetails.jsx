import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";

const BlogDetails = ({ darkMode }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [newComment, setNewComment] = useState("");
  const [otherBlogs, setOtherBlogs] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error("Error fetching blog:", error);
      else setBlog(data);
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("username, comment_text, created_at") // Ensuring created_at is selected
        .eq("blog_id", id);
      if (error) console.error("Error fetching comments:", error);
      else setComments(data);
    };

    const fetchOtherBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, image_url")
        .neq("id", id)
        .limit(3);
      if (error) console.error("Error fetching other blogs:", error);
      else setOtherBlogs(data);
    };

    fetchBlog();
    fetchComments();
    fetchOtherBlogs();
  }, [id]);

  const handleAddComment = async () => {
    if (!username || !newComment) {
      alert("Both username and comment are required!");
      return;
    }

    const newCommentData = {
      blog_id: id,
      username: username,
      comment_text: newComment,
      created_at: new Date().toISOString(), // Ensure created_at is set
    };

    const { error } = await supabase.from("comments").insert([newCommentData]);

    if (error) console.error("Error adding comment:", error);
    else {
      setComments((prev) => [...prev, newCommentData]);
      setUsername("");
      setNewComment("");
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className={`max-w-5xl mx-auto p-6 rounded-md shadow-lg ${darkMode ? "dark:bg-[#1e293b] dark:text-white" : "bg-white text-gray-800"}`}>
      <h1 className={`text-5xl font-bold mb-6 text-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        {blog.title}
      </h1>
      <img
        src={blog.image_url}
        alt={blog.title}
        className="w-full h-96 object-cover rounded-md shadow-md mb-6 transition-transform duration-300 ease-in-out hover:scale-105"
      />
      <div 
        className={`text-lg leading-8 mb-8 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <hr className={`border-gray-300 mb-8 ${darkMode ? "dark:border-gray-600" : ""}`} />

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className={`text-3xl font-semibold mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          Comments
        </h2>

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={index}
                className={`p-4 border ${darkMode ? "border-gray-600 dark:bg-gray-800" : "border-gray-300 bg-gray-50"} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4`}
              >
                <div className="w-12 h-12 bg-blue-500 text-white font-semibold flex items-center justify-center rounded-full shadow-md">
                  {comment.username ? comment.username[0].toUpperCase() : "U"}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {comment.username || "Anonymous"}
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} ml-2`}>
                      {comment.created_at ? new Date(comment.created_at).toLocaleString() : "Unknown Date"}
                    </span>
                  </p>
                  <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {comment.comment_text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {/* Add Comment */}
        <div className={`mt-10 p-6 border ${darkMode ? "dark:bg-gray-800 dark:border-gray-600" : "border-gray-300 bg-gray-50"} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300`}>
          <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            Add a Comment
          </h3>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
          <textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            rows="4"
          ></textarea>
          <button
            onClick={handleAddComment}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all"
          >
            Add Comment
          </button>
        </div>
      </div>

      <hr className={`border-gray-300 my-10 ${darkMode ? "dark:border-gray-600" : ""}`} />

      {/* Other Blogs Section */}
      <div className="other-blogs">
        <h2 className={`text-3xl font-semibold mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          Other Blogs You Might Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherBlogs.map((otherBlog) => (
            <Link
              to={`/blog/${otherBlog.id}`}
              key={otherBlog.id}
              className={`block border ${darkMode ? "dark:bg-gray-700 dark:border-gray-600" : "border-gray-300 bg-white"} rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={otherBlog.image_url} alt={otherBlog.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  {otherBlog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
