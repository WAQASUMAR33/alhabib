import UserLayout from "@/app/UserLayout";
import React from "react";

const About = () => {
  return (
    <UserLayout>
  <div className="py-12 px-6 bg-white ">
  <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          About Alhabib Travel Agency
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          At Alhabib Travel Agency, we are dedicated to providing world-class travel solutions tailored to your needs. Whether you're planning a vacation, a business trip, or an adventure, we are here to make your travel dreams a reality.
        </p>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to offer reliable, efficient, and cost-effective travel services to our clients. We strive to make every journey seamless and enjoyable while ensuring that all your travel needs are met with precision and care.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be recognized as the leading travel agency in Faisalabad and beyond by continuously exceeding customer expectations and delivering innovative travel solutions.
          </p>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Comprehensive travel packages for families, solo travelers, and corporate clients.</li>
            <li>Affordable and customizable Hajj and Umrah packages.</li>
            <li>Visa assistance and consultation services.</li>
            <li>Flight bookings and itinerary planning.</li>
            <li>24/7 customer support to ensure a hassle-free experience.</li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Alhabib Travel Agency?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Experienced team with in-depth knowledge of the travel industry.</li>
            <li>Affordable and competitive pricing for all travel services.</li>
            <li>Commitment to customer satisfaction and personalized support.</li>
            <li>Strong network of partners and vendors worldwide.</li>
          </ul>
        </section>

        {/* Contact Us Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <address className="text-gray-600 mt-2">
            <strong>Alhabib Travel Agency</strong> <br />
            jamia-tul-Habib jhung road Faisalabad <br />
            Phone: <a href="tel:+923222355327" className="text-blue-600 underline">+92322 2355327</a> <br />
            Email: <a href="mailto:info@alhabibtravel.com" className="text-blue-600 underline">info@alhabibtravel.com</a>
          </address>
        </section>
      </div>
    </div>
    </UserLayout>
  );
};

export default About;
