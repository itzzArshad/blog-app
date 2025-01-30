import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BlogCard from "../components/BlogCard";
import { motion } from "framer-motion";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase.from("blogs").select("*");
      if (error) console.error("Error fetching blogs:", error);
      else setBlogs(data);
    };

    fetchBlogs();
  }, []);

  // Track cursor position for glowing effect
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="p-6 md:p-10">
      {/* Heading Section */}
      <h1 
  className="text-4xl font-italic text-center mb-6 text-[var(--color-text)]"
  style={{ fontFamily: "'Bodoni Moda', serif" }}
>
  Click, Scroll, Repeat!
</h1>

<p 
  className="text-lg text-center mb-10 text-[var(--color-text)]"
  style={{ fontFamily: "'Playfair Display', serif" }}
>
  Fresh-baked stories, warm ideas, and zero calories
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

      {/* Author Section */}
      <div className="mt-16 flex justify-center">
        <motion.div
          className="relative w-full max-w-3xl p-8 rounded-xl shadow-lg text-center cursor-pointer overflow-hidden author-card"
          onMouseMove={handleMouseMove}
          style={{
            fontFamily: "'Playfair Display', serif",
            backdropFilter: "blur(10px)", // Glassmorphism effect
            WebkitBackdropFilter: "blur(10px)",
          }}
          initial={{ scale: 1 }}
          whileHover={{ rotateX: 10, rotateY: 10, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          {/* Glowing Effect */}
          <div
            className="absolute w-16 h-16 bg-white/20 blur-lg rounded-full pointer-events-none"
            style={{
              top: `${mousePos.y}%`,
              left: `${mousePos.x}%`,
              transform: "translate(-50%, -50%)",
            }}
          ></div>

          {/* Author Info */}
          <h2 className="text-3xl font-bold text-[var(--color-darkGrey)] dark:text-white">
            🌸 Riska Rahma
          </h2>
          <p className="mt-2 text-lg italic text-[var(--color-darkGrey)] dark:text-[var(--color-lightGrey)]">
           " A word enthusiast brewed with a cup of warm coffee and packaged with laughter."
           </p>
          <p className="mt-4 text-base font-medium text-[var(--color-darkGrey)] dark:text-white">
            Fiction writer | Lover of absurd phrases | Proud owner of a PhD in Procrastination

            <p>
            (but pinky promise—I always meet deadlines!).
            </p>
           
          </p>

          <hr className="my-4 border-[var(--color-lightGrey)] opacity-30" />

          <p className="text-base text-[var(--color-darkGrey)] dark:text-[var(--color-lightGrey)] leading-relaxed">
            From chaotic ideas ➜ <span className="font-semibold">99x revisions</span> ➜ that proud smile when I hit  
            <span className="italic"> ‘Publish’</span>.
          </p>

          <p className="mt-3 text-base">
            <span className="font-semibold">Specializes in:</span> Heart-fluttering romance,  
            family tales that stick like glue, and dialogues that feel like real convos.
          </p>

          <p className="mt-5 text-sm opacity-80 text-[var(--color-darkGrey)] dark:text-[var(--color-lightGrey)]">
            P.S. My fictional characters might be chaotic, but my professionalism?  
            <span className="font-semibold"> Always on fleek.</span> 
            <p>
            Let’s collab—snacks and plot twists guaranteed! ✨🛋️
              </p>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
