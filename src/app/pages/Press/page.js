import UserLayout from "@/app/UserLayout";
import React from "react";

const Press = () => {
  return (
    <UserLayout>
     <div className="py-12 px-6 bg-white ">
     <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          Press Room
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Welcome to the press page of Alhabib Travel Agency. Here you’ll find our latest press releases, media coverage, and resources for journalists and media professionals.
        </p>

        {/* Press Releases Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Press Releases</h2>
          <div className="space-y-4">
            <article className="border-b border-gray-300 pb-4">
              <h3 className="text-xl font-bold text-gray-700">
                Alhabib Travel Agency Launches New Hajj Packages for 2024
              </h3>
              <p className="text-sm text-gray-500">December 1, 2024</p>
              <p className="mt-2 text-gray-600">
                We’re excited to announce the launch of our new Hajj packages for 2024, offering affordable and premium options for pilgrims worldwide.
              </p>
              <a
                href="#"
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Read more →
              </a>
            </article>
            <article className="border-b border-gray-300 pb-4">
              <h3 className="text-xl font-bold text-gray-700">
                Alhabib Travel Recognized as Top Travel Agency in Faisalabad
              </h3>
              <p className="text-sm text-gray-500">November 15, 2024</p>
              <p className="mt-2 text-gray-600">
                Alhabib Travel Agency has been awarded the "Top Travel Agency in Faisalabad" for our exceptional service and customer satisfaction.
              </p>
              <a
                href="#"
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Read more →
              </a>
            </article>
          </div>
        </section>

        {/* Media Coverage Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Media Coverage
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                "Top 10 Travel Agencies in Pakistan" - The Tribune
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                "Innovative Travel Solutions by Alhabib" - Daily News
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                "Affordable Hajj Packages for 2024" - Faisalabad Times
              </a>
            </li>
          </ul>
        </section>

        {/* Media Resources Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Media Resources
          </h2>
          <p className="text-gray-600">
            Journalists and media professionals can download our press kit and
            brand assets below:
          </p>
          <div className="mt-4">
            <a
              href="/assets/press-kit.zip"
              download
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700"
            >
              Download Press Kit
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Our Media Team
          </h2>
          <p className="text-gray-600">
            For media inquiries, please reach out to us at:
          </p>
          <address className="text-gray-600 mt-2">
            <strong>Alhabib Travel Agency</strong> <br />
            jamia-tul-Habib jhung road Faisalabad <br />
            Phone:{" "}
            <a href="tel:+923222355327" className="text-blue-600 underline">
              +92322 2355327
            </a>
            <br />
            Email:{" "}
            <a
              href="mailto:media@alhabibtravel.com"
              className="text-blue-600 underline"
            >
              media@alhabibtravel.com
            </a>
          </address>
        </section>
      </div>
    </div>
    </UserLayout>
  );
};

export default Press;
