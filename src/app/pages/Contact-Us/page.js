import UserLayout from "@/app/UserLayout";
import React from "react";

const ContactUs = () => {
  return (
    <UserLayout>
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Contact Us
        </h1>

        {/* Contact Information Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700">Get in Touch</h2>
          <address className="text-gray-600 mt-4">
            <strong>Alhabib Travel Agency</strong>
            <br />
            Jamia-tul-Habib Jhang Road Faisalabad
            <br />
            Phone: +92322 2355327
            <br />
            Email:{" "}
            <a
              href="mailto:info@alhabibtravel.com"
              className="text-blue-600 underline"
            >
              info@alhabibtravel.com
            </a>
          </address>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-8 shadow-md rounded-lg border border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-600"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your message"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map Section */}
        <div className="mt-12">
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">
    Our Location
  </h2>
  <div className="h-[500px]">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212.83415924471316!2d73.03720660898065!3d31.404576794543125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392243c2a7d13f81%3A0x9b9e5bbdec46b5a0!2sjamia-tul-Habib%20jhung%20road%20Faisalabad!5e0!3m2!1sen!2s!4v1734780681443!5m2!1sen!2s"
      width="100%"
      height="100%"
      allowFullScreen=""
      loading="lazy"
      className="border-2 border-gray-300 rounded-md shadow h-full"
    ></iframe>
  </div>
</div>

      </div>
    </div>
    </UserLayout>
  );
};

export default ContactUs;
