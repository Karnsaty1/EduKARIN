import React from "react";
import NavbarBeforeLog from "./NavbarBeforeLog";
import logo from "../assets/Logo.png"; 

const Home = () => {
  return (
    <div className="div-home h-auto mt-[6vh] bg-black">
      <header className="home-display flex flex-col justify-center items-center h-[94vh]">
        <NavbarBeforeLog />
        <div className="flex justify-between items-center w-10/12 px-10 py-10 md:flex-row  flex-col">
          <h1 className="text-3xl md:text-5xl font-bold md:text-left text-center md:w-1/2 text-white">
            "Education is not the learning of facts, but the training of the mind to think."  
            <span className="block text-xl md:text-2xl  mt-2 text-gray-400">– Albert Einstein</span>
          </h1>

           <img
                        src={logo || "/placeholder.svg"}
                        alt="EduKARI Logo"
                        className="h-16 w-auto rounded-full shadow-lg shadow-black"
                      />
        </div>
      </header>

     
    </div>
  );
};

export default Home;
