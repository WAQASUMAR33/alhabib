// components/PrivacyPolicy.js
import UserLayout from "@/app/UserLayout";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <UserLayout>
    <section className="py-12 px-6 bg-white ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          At Alhabib Travel Agency, we are committed to protecting your privacy
          and ensuring that your personal information is handled securely. This
          Privacy Policy outlines how we collect, use, and safeguard your
          information when you use our services or visit our website.
        </p>

        {/* Section: Information We Collect */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-600 mb-2">
            We may collect the following types of personal information when you
            interact with our services:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Your name, email address, phone number, and address</li>
            <li>Payment details (processed securely)</li>
            <li>Travel preferences and booking details</li>
            <li>
              Information about your device and browser when you visit our
              website
            </li>
          </ul>
        </div>

        {/* Section: How We Use Your Information */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-600">
            We use your personal information to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Process bookings and payments</li>
            <li>Provide personalized travel recommendations</li>
            <li>Send confirmation emails and updates about your trips</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our services and user experience</li>
          </ul>
        </div>

        {/* Section: Your Rights */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-600">
            You have the right to access, update, or delete your personal
            information. If you wish to exercise these rights, please contact
            us at <a href="mailto:info@alhabibtravel.com" className="text-blue-600 underline">info@alhabibtravel.com</a>.
          </p>
        </div>

        {/* Section: Contact Us */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions or concerns about our Privacy Policy,
            please contact us at:
          </p>
          <address className="text-gray-600 mt-2">
            <strong>Alhabib Travel Agency</strong> <br />
            jamia-tul-Habib jhung road Faisalabad
            <br />
            Phone: +92322 2355327
            <br />
            Email: <a href="mailto:info@alhabibtravel.com" className="text-blue-600 underline">info@alhabibtravel.com</a>
          </address>
        </div>
      </div>
    </section>
    </UserLayout>
  );
};

export default PrivacyPolicy;
