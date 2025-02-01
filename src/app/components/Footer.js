import { FacebookOutlined } from "@mui/icons-material";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-700 w-full text-white py-8 border-t">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-8 md:grid-cols-5 ">
        {/* Company Information */}
        <div className="flex flex-col gap-3  col-span-2">
          <h2 className="text-3xl font-bold">AlHabib Travels</h2>
          <p className="leading-relaxed">
            Best Travel Agency providing services all over the world, top rated worldwide.
          </p>
          <p className="">Phone: +92 322 2355327</p>
          <p className="">
            Email:{" "}
            <a
              href="mailto:info@alhabibtravels.com"
              className="text-blue-500 hover:underline"
            >
              info@alhabibtravels.com
            </a>
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Company</h2>
          <a href="/pages/About" className="hover:text-blue-500 hover:underline">
            About 
          </a>
          <a href="/pages/Press" className="hover:text-blue-500 hover:underline">
            Press
          </a>
          <a href="/pages/Privacy-Policy" className="hover:text-blue-500 hover:underline">
            Privacy Policy
          </a>
          <a href="/pages/Terms-Of-Service" className="hover:text-blue-500 hover:underline">
            Terms of Service
          </a>
          <a href="/pages/Contact-Us" className="hover:text-blue-500 hover:underline">
            Contact Us
          </a>
        </div>

        {/* Learn More Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Learn More</h2>
          <a href="/User-Registeration" className="hover:text-blue-500 hover:underline">
            Become an Agent
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Affiliates
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Advertise
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Hoteliers
          </a>
        
        </div>

        {/* Explore Links */}
        {/* <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Explore</h2>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Airport Directory
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Airline Directory
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Flight Schedule
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            Hotel Chains
          </a>
        </div> */}

        {/* Download Links */}
        <div className="flex flex-col gap-2  justify-between">
          {/* <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Download</h2>
          <a href="#" className="hover:text-blue-500 hover:underline">
            AlHabib App (iOS)
          </a>
          <a href="#" className="hover:text-blue-500 hover:underline">
            AlHabib App (Android)
          </a>
          </div> */}
          <div>
          <h2 className="text-xl font-semibold">Follow Us</h2>
          <div className="flex gap-4 text-3xl">
          <a href="https://www.facebook.com/profile.php?id=100090524899051" className="hover:text-blue-500 hover:underline">
            <FaFacebook/> 
          </a> 
          <a href="https://www.instagram.com/alhabibtraveland" className="hover:text-blue-500 hover:underline">
            <FaInstagram/>
          </a> 
          <a href="https://youtube.com/@alhabibtravels1?si=UoF0NQnixgs_-OiP" className="hover:text-blue-500 hover:underline">
            <FaYoutube/>
          </a>
          </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 text-center text-sm">
        © {new Date().getFullYear()} AlHabib Travels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
