import React, { useState } from "react";

const AuthorSection = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 10;
    const y = (top + height / 2 - e.clientY) / 10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="author-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--tilt-x": `${tilt.y}deg`,
        "--tilt-y": `${tilt.x}deg`,
      }}
    >
      <div className="card-inner">
        <div>
          <h2>Riska Rahma</h2>
          <p>Passionate about sharing knowledge through blogs.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorSection;
