// Destinations.jsx
import React from "react";

const Destinations = () => {
  const destinations = [
    { 
      name: "Global Destinations", 
      image: "/populardestinations/global.jpg", 
      description: "Explore iconic landmarks." 
    },
    { 
      name: "Local Attractions", 
      image: "/populardestinations/local.jpg", 
      description: "Discover highlights close to home." 
    },
    { 
      name: "Hajj", 
      image: "/populardestinations/hajj.jpg", 
      description: "A spiritual journey to Mecca." 
    },
    { 
      name: "Umrah", 
      image: "/populardestinations/umrah.png", 
      description: "Experience spirituality of Umrah." 
    },
  ];
  
  return (
    <section id="destinations" className=" py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Popular Destinations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className=" relative bg-white border border-gray-200 rounded-lg group overflow-hidden"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-80 object-cover rounded-lg group-hover:scale-[1.1] transition-all duration-500"
              />
              <div className="absolute border bg-black/30 border-green-400 flex flex-col justify-center items-center inset-0 h-80">
              <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
              <p className="text-white mt-2">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
