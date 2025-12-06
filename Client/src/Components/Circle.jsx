import React, { useEffect, useState } from "react";

const Circle = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [mouseX, setMouseX] = useState(0);

  useEffect(() => {
    // Scroll Parallax
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.1); // slow parallax movement
    };

    // Mouse Parallax (slight left/right drift)
    const handleMouseMove = (e) => {
      setMouseX((e.clientX - window.innerWidth / 2) * 0.02);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden">

      {/* Neon Moon Glow Background */}
      <div
        className="absolute left-1/2 w-[1000px] h-[1000px]"
        style={{
          top: `calc(800px + ${offsetY}px)`, // moves SLOWER than scroll
          transform: `translateX(calc(-50% + ${mouseX}px))`,
        }}
      >

        {/* Outer Glow Arc */}
        <div
          className="absolute inset-0 rounded-full
                     bg-[conic-gradient(from_180deg_at_center,
                     rgba(255,0,200,0.5),
                     rgba(120,0,255,0.4),
                     rgba(255,0,200,0.5))]
                     opacity-40 blur-[60px]"
        ></div>

        {/* Inner Soft Circle */}
        <div
          className="absolute inset-0 rounded-full
                     bg-[radial-gradient(circle,rgba(200,0,255,0.35),transparent_65%)]
                     blur-[80px] opacity-60 z-10"
        ></div>

        {/* Bottom Fade */}
        <div
          className="absolute inset-0 rounded-full
                     bg-gradient-to-b from-transparent to-[#0A0A0C]"
        ></div>
      </div>
    </div>
  );
};

export default Circle;
