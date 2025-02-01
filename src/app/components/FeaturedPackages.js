'use client'
import { useState, useEffect } from "react";
// FeaturedPackages.jsx
import React from "react";

const FeaturedPackages = () => {
  const [fetchedpackages, setfetchedpackages]= useState('');
  const [loading, setloading]=useState(false)
  useEffect(()=>{
    setloading(true)
    const fetchPackages = async () => {
    const response = await fetch('/api/user/packages');
    const data = await response.json();
    setfetchedpackages(data);
    }
    fetchPackages();
    setloading(false)
  },[1]);

  if(loading){
    return <div>Loading...</div>;
  }
  return (
    <section id="packages" className="bg-white py-16">
      <div className="md:max-w-7xl mx-auto text-center md:px-0 px-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Packages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {fetchedpackages && fetchedpackages.map((pkg, index) => (
            <div key={index} className="p-1 h-full w-full">
            <div
              className=" bg-white border h-full border-gray-400 hover:border-blue-400 hover:scale-[1.01] transition-all duration-500 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${pkg.image}`}
                alt={pkg.title}
                className="w-full h-40 md:h-[40vh] object-cover border-b border-gray-400"
              />
              <div className="p-2 md:px-3 md:py-2 text-left ">
              <h3 className="text-base md:text-xl font-[600] text-gray-800 group-hover:text-blue-500">{pkg.title}</h3>
              <p className="text-xs md:text-base text-gray-600 mt-0 line-clamp-2">{pkg.description}</p>
              <p className="text-sm md:text-lg font-bold text-gray-800 mt-0 ">{pkg.amount} Rs/-</p>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
