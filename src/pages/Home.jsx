import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase.from("blogs").select("*");
      if (error) console.error("Error fetching blogs:", error);
      else setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="p-6 md:p-10">
      {/* Heading Section */}
      <h1 className="text-4xl font-extrabold text-[var(--color-lightBlue)] mb-6 text-center">
        Explore Our Blogs
      </h1>
      <p className="text-lg text-center text-[var(--color-lightGrey)] mb-10">
        Discover insightful articles and stories curated just for you.
      </p>

      {/* Blog Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <p className="text-center text-[var(--color-lightGrey)] col-span-full">
            No blogs available yet. Check back later!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
