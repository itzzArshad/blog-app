import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleCardClick = () => {
    navigate(`/blog/${blog.id}`);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      className="relative cursor-pointer bg-[var(--color-blue)] rounded-lg shadow-md overflow-hidden 
                 transform hover:scale-105 hover:shadow-xl transition-all duration-300 
                 border border-transparent"
      style={{
        "--x": "50%",
        "--y": "50%",
        backgroundImage:
          "radial-gradient(circle at var(--x) var(--y), rgba(235, 149, 164, 0.3), transparent)",
        borderImage: `radial-gradient(circle at var(--x) var(--y), rgba(235, 149, 164, 1), rgba(107, 36, 50, 0.5)) 1`,
        borderImageSlice: 1,
      }}
    >
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)] truncate">
          {blog.title}
        </h2>
        {/* Use `dangerouslySetInnerHTML` to render HTML content */}
        <p
          className="text-sm text-[var(--color-lightGrey)] mt-2 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: blog.content }} // Render HTML content
        />
      </div>

      {/* Footer Section */}
      <div className="p-4 flex justify-between items-center border-t border-[var(--color-grey)]">
        <span className="text-sm text-[var(--color-lightBlue)]">
          Read More →
        </span>
        <span className="text-xs text-[var(--color-lightGrey)]">
          {new Date(blog.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default BlogCard;
