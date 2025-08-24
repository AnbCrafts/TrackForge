import { useEffect, useState } from "react";

const colors = ["#f87171", "#34d399", "#60a5fa", "#facc15", "#f472b6"];

export default function FullScreenBlastConfetti() {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 500 small confetti pieces
    const newConfetti = Array.from({ length: 500 }).map(() => {
      const angle = Math.random() * 2 * Math.PI; // random direction
      const radius = Math.random() * Math.max(width, height) / 2; // distance from center
      return {
        id: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        x: `${Math.cos(angle) * radius}px`,
        y: `${Math.sin(angle) * radius}px`,
        rotate: `${Math.random() * 720}deg`,
        scale: 0.5 + Math.random() * 1,
        w: 6 + Math.random() * 6,
        h: 12 + Math.random() * 6,
      };
    });

    setConfetti(newConfetti);

    const timer = setTimeout(() => setConfetti([]), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-sm"
          style={{
            backgroundColor: c.color,
            width: `${c.w}px`,
            height: `${c.h}px`,
            left: "50%",
            top: "50%",
            transform: `translate(0,0) scale(${c.scale})`,
            animation: `confetti 3s ease-out forwards`,
            "--x": c.x,
            "--y": c.y,
            "--rotate": c.rotate,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
