import { useEffect } from "react";

const AddResponsiveClass = () => {
  useEffect(() => {
    // Select all divs on the page
    const allDivs = document.querySelectorAll("div");

    // Loop through each div and add the class
    allDivs.forEach((div) => {
      div.classList.add("responsive-flex");
    });

    // Optional cleanup: remove class when component unmounts
    return () => {
      allDivs.forEach((div) => {
        div.classList.remove("responsive-flex");
      });
    };
  }, []); // empty dependency array → runs once on mount

  return null; // this component does not render anything
};

export default AddResponsiveClass;
