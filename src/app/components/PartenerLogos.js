// Partners.jsx
import React from "react";

const Partners = () => {
  const partners = [
    { name: "Airline Partner 1", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmk4w4MeIg25dFIpSqW3O6paa6a6IlQ7zQw&s" },
    { name: "Hotel Chain Partner", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTZdJHXpPo3Sp-HM-X4LQ1NVyIaGyBM782Ng&s" },
    { name: "Tourism Board", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl61HKPLtJJU74djdcJDtlQyv4n8SuufbuJRf_5uV8ccjMCPWho68gPWVW7E-DyBCxqnQ&usqp=CAU" },
    { name: "Travel Partner 4", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdSBqpdmgnpStGPirhhpKys23VwelJhTC5q9fCgG3_tIOgmdebRP0K2Ym8AQmdrbfwM_U&usqp=CAU" },
    { name: "Airline Partner 1", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmk4w4MeIg25dFIpSqW3O6paa6a6IlQ7zQw&s" },
    { name: "Hotel Chain Partner", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTZdJHXpPo3Sp-HM-X4LQ1NVyIaGyBM782Ng&s" },
    { name: "Tourism Board", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl61HKPLtJJU74djdcJDtlQyv4n8SuufbuJRf_5uV8ccjMCPWho68gPWVW7E-DyBCxqnQ&usqp=CAU" },
    { name: "Travel Partner 4", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdSBqpdmgnpStGPirhhpKys23VwelJhTC5q9fCgG3_tIOgmdebRP0K2Ym8AQmdrbfwM_U&usqp=CAU" },
  ];

  return (
    <section id="partners" className="bg-white py-16">
      <div className="md:w-[87vw] mx-auto text-center flex flex-col md:grid grid-cols-6 gap-2">
        <div className="flex flex-col col-span-2 justify-start md:items-start py-10  ">
          <h2 className="text-3xl font-bold mb-4 md:max-w-sm md:text-left">Top Popular Airline In Pakistan</h2>
          <p className=""> Our airline partners are the best in the industry.</p>
        </div>
        <div className="grid grid-cols-6 col-span-4 gap-2">
          <img src="https://logowik.com/content/uploads/images/pakistan-international-airlines4661.logowik.com.webp" className="size-32"></img>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2jLtQHwB50n3vE3j-OLhAwARx-Adudntcbg&s" className="size-32"></img>
          <img src="https://logowik.com/content/uploads/images/pakistan-international-airlines4661.logowik.com.webp" className="size-32"></img>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2jLtQHwB50n3vE3j-OLhAwARx-Adudntcbg&s" className="size-32"></img>
          <img src="https://logowik.com/content/uploads/images/pakistan-international-airlines4661.logowik.com.webp" className="size-32"></img>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2jLtQHwB50n3vE3j-OLhAwARx-Adudntcbg&s" className="size-32"></img>
          <img src="https://logowik.com/content/uploads/images/pakistan-international-airlines4661.logowik.com.webp" className="size-32"></img>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2jLtQHwB50n3vE3j-OLhAwARx-Adudntcbg&s" className="size-32"></img>
        </div>

      </div>
      <div className="md:w-[87vw] mx-auto text-center flex flex-col  md:grid grid-cols-6 gap-2">
        <div className="flex flex-col col-span-2 justify-start md:items-start md:py-0 py-10 ">
          <h2 className="text-3xl font-bold mb-4 md:max-w-sm md:text-left">Our Trusted Parteners</h2>
          <p> Our partners are the best in the industry.</p>
        </div>
        <div className="grid grid-cols-6 col-span-4 gap-2">
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center size-32 border">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Partners;
