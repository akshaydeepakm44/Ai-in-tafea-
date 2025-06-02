// src/pages/SignUp.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Phone, User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { addFellow } from '../services/login';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "", // Add mobile to form data
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fellowDTO = await addFellow(formData.name, formData.email, formData.mobile);
      console.log('Fellow created:', fellowDTO);
      navigate('/login');
    } catch (error) {
      console.error('Failed to create fellow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex === -1) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add your OTP verification logic here
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#6E57E6] to-[#9181F4] px-4 py-8">
      {/* 3D Spheres */}
      <div
        className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#A89CF4] opacity-70"
        style={{ boxShadow: "0 0 40px rgba(168, 156, 244, 0.5)" }}
      />
      <div
        className="absolute -right-20 top-1/3 h-40 w-40 rounded-full bg-[#A89CF4] opacity-70"
        style={{ boxShadow: "0 0 40px rgba(168, 156, 244, 0.5)" }}
      />
      <div
        className="absolute bottom-20 left-1/4 h-32 w-32 rounded-full bg-[#A89CF4] opacity-70"
        style={{ boxShadow: "0 0 40px rgba(168, 156, 244, 0.5)" }}
      />

      {/* Sign Up Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#2D1B69]">
          SIGN UP
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 px-11 py-3 text-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#6E57E6]"
              required
            />
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 px-11 py-3 text-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#6E57E6]"
              required
            />
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="tel"
              name="mobile"
              placeholder="Phone Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full rounded-xl bg-gray-100 px-11 py-3 text-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#6E57E6]"
              required
              pattern="[0-9]{10}"
              maxLength={10}
            />
            <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !formData.name ||
              !formData.email ||
              formData.mobile.length !== 10
            }
            className="w-full rounded-xl bg-[#2D1B69] py-3 text-sm font-medium text-white transition-colors hover:bg-[#231458] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#FF5757] hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}