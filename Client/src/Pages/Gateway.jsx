import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import NewTestimonialSection from "../Components/FAQSection";
import Nav from "../Components/Nav";
import HeroSection from "../Components/HeroSection";
import WhySection from "./WhySection";
import IndividualUsers from "../Components/IndividualUsers";
import TeamUsers from "../Components/TeamUsers";
import ProjectSection from "../Components/ProjectSection";
import Circle from "../Components/Circle";

const Gateway = () => {

 

  
  return (

    <div className="min-h-[100vh] w-full mx-auto relative ">
      
      <Nav/>
      <Circle/>

      



    <div className="w-full backdrop-blur-md pt-28 relative overflow-hidden z-10">

      


  {/* Floating Gradient Blobs */}
  <div className="hero-blob blob-1"></div>
  <div className="hero-blob blob-2"></div>
      <HeroSection/>
      <WhySection/>
      <IndividualUsers/>
      <TeamUsers/>
      <ProjectSection/>
      <NewTestimonialSection/>
      <Footer/>

</div>

    

    </div>

  );
};

export default Gateway;
