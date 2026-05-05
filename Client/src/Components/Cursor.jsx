// import { useEffect } from "react";

// export default function SmokeCursor() {
//   useEffect(() => {
//     const container = document.getElementById("cursor-layer");

//     const createSmoke = (x, y) => {
//       const smoke = document.createElement("div");
//       smoke.className = "smoke-particle";

//       smoke.style.left = `${x}px`;
//       smoke.style.top = `${y}px`;

//       container.appendChild(smoke);

//       setTimeout(() => smoke.remove(), 800);
//     };

//     window.addEventListener("mousemove", (e) => {
//       createSmoke(e.clientX, e.clientY);
//     });

//     return () => window.removeEventListener("mousemove", createSmoke);
//   }, []);

//   return null;
// }
import React from 'react'

const Cursor = () => {
  return (
    <div>
      
    </div>
  )
}

export default Cursor
