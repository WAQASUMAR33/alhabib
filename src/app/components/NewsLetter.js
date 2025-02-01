// Newsletter.jsx
import React from "react";

const Newsletter = () => {
  return (
    <section id="newsletter" className="bg-blue-600 text-white py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
        <p className="text-lg mb-6">Stay updated with the latest deals and travel tips!</p>
        <form className="flex flex-col md:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg w-full md:w-1/3"
          />
          <button
            type="submit"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-white"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
