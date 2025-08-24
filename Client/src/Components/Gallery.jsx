import React from "react";

const Gallery = ({ images }) => {
  return (
    <div className="flex items-center flex-wrap justify-center relative mt-10 max-w-5xl">
      {images.map((img, index) => (
        <div
          key={index}
          className={`relative cursor-pointer transform transition-all duration-300 ease-in-out 
            hover:scale-110 hover:z-50`}
          style={{ marginLeft: index !== 0 ? "-60px" : "0" }} // overlap
        >
          <img
            src={img.image} // changed from img.src to img.image
            alt={img.title}
            className="w-64 h-40 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {img.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
