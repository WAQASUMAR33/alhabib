// Testimonials.jsx
import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      feedback: "The trip was perfectly organized, and the service was excellent. Highly recommended!",
      image: "https://via.placeholder.com/100",
    },
    {
      name: "Jane Smith",
      feedback: "Thanks to Al Habib Travel Agency, my family vacation was stress-free and enjoyable.",
      image: "https://via.placeholder.com/100",
    },
    {
      name: "Ahmed Khan",
      feedback: "Great experience! Their team went above and beyond to ensure our satisfaction.",
      image: "https://via.placeholder.com/100",
    },
  ];

  return (
    <section id="testimonials" className="bg-white py-16">
      <div className="container mx-auto text-center px-2 md:px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-2 md:p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">{testimonial.name}</h3>
              <p className="text-gray-600 mt-2 italic">"{testimonial.feedback}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
