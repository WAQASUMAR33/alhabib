'use client'
import React from "react";
import { CheckCircle, Headphones, Package, DollarSign, Plane } from 'lucide-react'; // Import Lucide icons

const WhyChooseUs = () => {
  const benefits = [
    { icon: <CheckCircle className="text-green-500 size-16 md:size-24" />, text: "24/7 Customer Support" },
    { icon: <Headphones className="text-blue-500 size-16 md:size-24" />, text: "Tailored Travel Packages" },
    { icon: <DollarSign className="text-yellow-500 size-16 md:size-24" />, text: "Competitive Prices" },
    { icon: <Package className="text-red-500 size-16 md:size-24" />, text: "Trusted by Thousands of Travelers" },
    { icon: <Plane className="text-orange-500 size-16 md:size-24" />, text: "Premium Flights" },
  ];

  return (
    <section id="why-choose-us" className=" py-16">
      <div className=" mx-auto text-center px-2 md:px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col md:size-full border border-gray-300 justify-center items-center bg-transparent transition-all duration-500  hover:border-black md:p-6 py-6 rounded-xl hover:scale-105"
            >
              <div className="mb-4 p-1 md:p-3 ">
                {benefit.icon}
              </div>
              <p className="text-xs md:text-lg font-semibold text-gray-800">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
