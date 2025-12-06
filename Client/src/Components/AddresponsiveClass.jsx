import { useEffect } from "react";

const AddResponsiveClass = () => {
  useEffect(() => {
    const divs = document.querySelectorAll("div");

    divs.forEach((div) => {
      if (!div.classList.contains("responsive-flex")) {
        div.classList.add("responsive-flex");
      }
    });

    return () => {
      divs.forEach((div) => {
        div.classList.remove("responsive-flex");
      });
    };
  }, []);

  return null;
};

export default AddResponsiveClass;
