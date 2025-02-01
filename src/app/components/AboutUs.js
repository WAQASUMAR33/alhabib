import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="bg-white py-10 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-start ">
          {/* Left Side - Content */}
          <div className="md:w-1/2 text-center md:text-left flex flex-col text-base md:text-lg">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
            <p className="text-gray-600 md:leading-relaxed md:px-0 px-4 text-justify md:text-pretty">
              Welcome to Al Habib Travel Agency, your trusted partner for seamless travel experiences. With over 20 years of expertise, we specialize in creating unforgettable journeys tailored to your needs.
              <br></br>
              At the heart of our agency lies a passion for connecting people to the world through travel. We believe that every journey should be as unique as the traveler embarking on it. Whether it's a solo adventure, a family vacation, or a corporate retreat, we are dedicated to crafting personalized itineraries that reflect your dreams and desires.
              <br></br>
              At Al Habib Travel Agency, customer satisfaction is more than a priority—it’s our driving force. Our attention to detail, personalized service, and dedication to creating memorable moments have established us as a leader in the travel industry. With us, you're not just booking a trip; you're embarking on a carefully crafted journey designed to leave a lasting impression.

            </p>

          </div>

          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center border md:h-[50%]">

            <img
              src="https://www.malaysiaairlines.com/content/dam/mh/hq/en/promotions/exclusive-deals/750x620.jpg"
              alt="About Us"
              className="w-full h-full md:rounded-lg shadow-md object-cover"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
