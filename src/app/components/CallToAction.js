// CallToAction.jsx
import React from "react";

const CallToAction = () => {
  return (
    <section id="cta" className="bg-blue-600 text-white py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Ready to Plan Your Next Trip?</h2>
        <p className="text-lg mb-8">
          Contact us today and let us make your travel dreams a reality. Your perfect vacation starts here!
        </p>
        <a
          href="#contact"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-white"
        >
          Book Now
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
