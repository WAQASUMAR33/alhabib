import React from "react";
import { Plane, Hotel, Package, Globe } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Flight Booking",
      description: "Book flights to any destination at the best rates.",
      icon: <Plane className="w-6 h-6 text-white" />,
    },
    {
      title: "Hotel Reservations",
      description: "Find the perfect stay for your travel.",
      icon: <Hotel className="w-6 h-6 text-white" />,
    },
    {
      title: "Tour Packages",
      description: "Explore curated travel packages for every budget.",
      icon: <Package className="w-6 h-6 text-white" />,
    },
    {
      title: "Visa Assistance",
      description: "Hassle-free visa processing for a smooth journey.",
      icon: <Globe className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <section id="services" className=" py-16">
      <div className="container mx-auto px-2 md:px-6 text-center">
        <h2 className="text-4xl font-semibold text-gray-700 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative p-4 md:p-8  border border-gray-300 hover:border-gray-500 bg-white rounded-2xl shadow-md transition-all duration-300 hover:scale-105"
            >
              {/* Icon with circular background */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                  {service.icon}
                </div>
              </div>
              {/* Title */}
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-all duration-300">
                {service.title}
              </h3>
              {/* Description */}
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                {service.description}
              </p>
              {/* Decorative Line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 mt-4 group-hover:bg-blue-500 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
