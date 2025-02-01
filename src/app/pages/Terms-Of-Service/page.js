// components/TermsOfService.js
import UserLayout from "@/app/UserLayout";
import React from "react";

const TermsOfService = () => {
  return (
    <UserLayout>
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          Welcome to Alhabib Travel Agency! These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to comply with these terms. Please read them carefully.
        </p>

        {/* Section: Acceptance of Terms */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-gray-600">
            By using our website or services, you confirm that you agree to these Terms of Service and our Privacy Policy. If you do not agree, you may not use our services.
          </p>
        </div>

        {/* Section: Use of Services */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Use of Services
          </h2>
          <p className="text-gray-600">
            You agree to use our services only for lawful purposes and in a manner that does not violate the rights of others. Prohibited activities include, but are not limited to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Using the service for fraudulent activities</li>
            <li>Disrupting or interfering with the functionality of the website</li>
            <li>Violating any applicable local, state, national, or international laws</li>
          </ul>
        </div>

        {/* Section: Bookings and Payments */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bookings and Payments
          </h2>
          <p className="text-gray-600">
            All bookings made through our platform are subject to availability. Payments are processed securely, and it is your responsibility to ensure that your payment information is accurate.
          </p>
        </div>

        {/* Section: Cancellations and Refunds */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Cancellations and Refunds
          </h2>
          <p className="text-gray-600">
            Cancellation and refund policies vary depending on the type of booking. Please review the specific terms for your booking before confirming your reservation.
          </p>
        </div>

        {/* Section: Limitation of Liability */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-600">
            Alhabib Travel Agency is not responsible for any indirect, incidental, or consequential damages arising from your use of our services. Our liability is limited to the maximum extent permitted by law.
          </p>
        </div>

        {/* Section: Modifications to Terms */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Modifications to Terms
          </h2>
          <p className="text-gray-600">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. It is your responsibility to review the terms periodically for updates.
          </p>
        </div>

        {/* Section: Contact Us */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions or concerns regarding these Terms of Service, please contact us at:
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

export default TermsOfService;
