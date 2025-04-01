import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loading from './Spinner-5.gif';

const Log = () => {
  const [check, setCheck] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rep1 = await fetch(`${import.meta.env.VITE_BACKEND}/auth/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (rep1.ok) {
        setCheck(true);
      } else {
        console.log("Log-in failed:", rep1.statusText);
      }
    } catch (error) {
      console.log("Error during log-in:", error);
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const otpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    const otpNumber = parseInt(otpValue, 10);

    if (otpValue.length !== 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const rep2 = await fetch(`${import.meta.env.VITE_BACKEND}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: formData.email, otp: otpNumber }),
      });
      if (rep2.ok) {
        navigate("/dashboard");
      } else {
        const text = await rep2.text();
        console.log("OTP verification failed:", text);
      }
    } catch (error) {
      console.log("Error during OTP verification:", error);
    }
    setLoading(false);
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen bg-black">
      <img src={Loading || "/placeholder.svg"} alt="Loading..." className="w-16 h-16" />
    </div>
  ) : !check ? (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-md">
        
        <div className="absolute inset-0 bg-cyan-400 rounded-4xl transform rotate-3"></div>
        
        <div className="relative bg-white p-8 rounded-3xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-2">EduKARI</h1>
          <p className="text-center text-gray-600 mb-4">
            <Link to='/sign' className="text-blue-500 hover:underline">New to EduKARI?</Link>
          </p>
          <h2 className="text-xl font-semibold text-center mb-6">Log In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400" 
              />
            </div>
            
            <div className="space-y-2">
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-md transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-cyan-400 rounded-3xl transform rotate-3"></div>
        
        <div className="relative bg-white p-8 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold text-center mb-6">Enter OTP</h2>
          
          <form onSubmit={otpSubmit} className="flex flex-col items-center space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input 
                  key={index} 
                  type="text" 
                  value={digit} 
                  maxLength={1} 
                  onChange={(e) => handleOtpChange(index, e.target.value)} 
                  onKeyDown={(e) => handleKeyDown(index, e)} 
                  ref={(el) => (otpRefs.current[index] = el)} 
                  className="w-10 h-10 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-cyan-400" 
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-md transition-colors"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Log;
