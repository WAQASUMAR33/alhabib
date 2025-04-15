'use client';
import { useState, useEffect } from "react";
import { Inter } from 'next/font/google';

// Load Inter font with desired weights
const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const FeaturedPackages = () => {
  const [fetchedpackages, setfetchedpackages] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setloading(true);
      try {
        const response = await fetch('/api/user/packages');
        if (!response.ok) throw new Error('Failed to fetch packages');
        const data = await response.json();
        setfetchedpackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setloading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <section id="packages" className="bg-white py-16">
      <div className="md:max-w-7xl mx-auto text-center md:px-0 px-4">
        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight ${inter.className}`}>
          Featured Packages
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {fetchedpackages && fetchedpackages.length > 0 ? (
            fetchedpackages.map((pkg, index) => (
              <div key={index} className="p-1 h-full w-full">
                <div
                  className={`bg-white border border-gray-200 hover:border-blue-300 hover:scale-[1.02] transition-all duration-300 rounded-lg overflow-hidden group cursor-pointer shadow-sm ${inter.className}`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${pkg.image}`}
                    alt={pkg.title}
                    className="w-full h-40 md:h-64 object-cover border-b border-gray-200"
                    onError={(e) => (e.target.src = '/fallback-image.jpg')} // Optional fallback
                  />
                  <div className="p-4 md:p-5 text-left">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 tracking-tight mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-sm md:text-base font-normal text-gray-600 line-clamp-2 mb-3">
                      {pkg.description}
                    </p>
                    <p className="text-base md:text-lg font-bold text-gray-900">
                      {pkg.amount} PKR
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No packages available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;