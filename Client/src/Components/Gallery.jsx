import React from "react";

export default function Gallery({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No images available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto px-4">
      {items.map((img, index) => (
        <div
          key={index}
          className="relative group rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200"
        >
          <img
            src={img.image}
            alt={img.title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition duration-500">
            <h3 className="text-white text-lg font-medium drop-shadow-sm">
              {img.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
