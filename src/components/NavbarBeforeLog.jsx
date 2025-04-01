import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png"; // Ensure the logo is in the correct folder

const NavbarBeforeLog = () => {
  return (
    <nav className="bg-black text-white flex justify-between items-center fixed w-full top-0 pt-4 md:pt-0 left-0 z-50" style={{ height: "7vw" }}>
      {/* Left Side: Logo + Brand Name */}
      <div className="flex items-center space-x-3 px-6">
         <img
                      src={logo || "/placeholder.svg"}
                      alt="EduKARI Logo"
                      className="h-16 w-auto rounded-full shadow-lg shadow-black"
                    />
        <h1 className="text-2xl font-bold text-[37px]">EduKARI</h1>
      </div>

      {/* Right Side: Sign Up Button */}
      <Link to="/sign">
        <button className="px-5 py-2 text-white font-bold mr-6 text-[32px]">SignUp</button>
      </Link>
    </nav>
  );
};

export default NavbarBeforeLog;
