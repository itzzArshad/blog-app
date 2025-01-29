import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Editor } from "@tinymce/tinymce-react";

const BlogEditor = ({ onSuccess, blog = null, resetEditing }) => {
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      fetchComments(blog.id);
    }
  }, [blog]);

  const fetchComments = async (blogId) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("blog_id", blogId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let publicURL = blog?.image_url;
      if (image) {
        const fileName = `${Date.now()}_${image.name}`;
        setIsUploading(true);
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, image);

        if (fileError) throw fileError;
        
        const { data: urlData, error: urlError } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        if (urlError) throw urlError;
        publicURL = urlData.publicUrl;
      }

      const blogData = { title, content, image_url: publicURL };
      if (blog) {
        await supabase.from("blogs").update(blogData).eq("id", blog.id);
      } else {
        await supabase.from("blogs").insert([blogData]);
      }

      onSuccess();
      resetEditing?.();
    } catch (error) {
      console.error("Error saving blog:", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded-md"
      />
<Editor
  apiKey="7p1fuj3vtny9bobhguvfrcno58f27uf6ea5wltcf44f8jztd" // Replace with your TinyMCE API key
  value={content}
  onEditorChange={(newContent) => setContent(newContent)}
  init={{
    height: 400,
    menubar: true,
    plugins: [
      "advlist", "autolink", "lists", "link", "image", "charmap", 
      "preview", "anchor", "searchreplace", "visualblocks", 
      "code", "fullscreen"
    ],
    toolbar:
      "undo redo | formatselect | fontselect | forecolor backcolor | " +
      "bold italic underline | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist outdent indent | removeformat | image",
    images_upload_url: "/upload", // Adjust as needed
    font_formats:
      "Georgia=georgia, serif; " +
      "Merriweather=merriweather, serif; " +
      "Playfair Display=playfair display, serif; " +
      "Roboto=roboto, sans-serif; " +
      "Open Sans=open sans, sans-serif; " +
      "Lato=lato, sans-serif; " +
      "Poppins=poppins, sans-serif; " +
      "Courier New=courier new, monospace; " +
      "Source Code Pro=source code pro, monospace;",
    content_style: `
      body {
        font-family: 'Georgia', serif;
        font-size: 16px;
        line-height: 1.6;
      }
    `,
  }}
/>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} className="p-2" />
      {image && (
        <div className="mb-4">
          <img src={URL.createObjectURL(image)} alt="Preview" className="max-w-full h-auto" />
        </div>
      )}

      <button
        type="submit"
        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : blog ? "Update Blog" : "Submit"}
      </button>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md mb-2"
            >
              <div>
                <p className="text-gray-800 dark:text-gray-100">{comment.comment_text}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">- {comment.username}</p>
              </div>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No comments yet.</p>
        )}
      </div>
    </form>
  );
};

export default BlogEditor;
