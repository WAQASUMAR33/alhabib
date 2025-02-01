'use client'
import { useState } from 'react';
import { FaSearch, FaExchangeAlt, FaPlane, FaCalendarAlt } from "react-icons/fa";

export default function HeroSection() {
    const [tripType, setTripType] = useState('round');

    return (
        <div className="relative w-full md:h-screen bg-[url('/herosection/hero2.jpg')] bg-cover bg-center py-10">
            {/* Gradient overlay for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/30" />

            <div className="relative h-full w-full flex flex-col justify-center items-center px-4 py-12">
                <div className="text-center mb-8 md:mb-12">
                    <h1
                        style={{ WebkitTextStroke: '2px white' }}
                        className="text-6xl md:text-8xl font-[800] text-purple-600"
                    >
                        AlHabib
                    </h1>

                    <p className="text-white text-xl md:text-2xl mt-4 max-w-2xl mx-auto">
                        Your Journey Begins With Us - Fly to Your Dreams
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-5xl p-6 md:p-8 transform transition-all duration-300 ">
                    {/* Trip Type Selector */}
                    <div className="flex gap-4">
                        {['round', 'one-way'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setTripType(type)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                                           ${tripType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                            >
                                {type === 'round' ? 'Round Trip' : 'One Way'}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col md:flex-row gap-6 flex-1">
                            {/* From and To Fields Container */}
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="relative flex-1">
                                    <div className="flex flex-col w-full">
                                        <label className="block text-base font-semibold text-gray-700 mb-1">
                                            From
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                                                <FaPlane className="rotate-0" />
                                            </div>
                                            <select
                                                className="w-full rounded-lg pl-10 pr-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                                defaultValue="LHE"
                                            >
                                                <option value="LHE">Lahore (LHE)</option>
                                                <option value="KHI">Karachi (KHI)</option>
                                                <option value="ISB">Islamabad (ISB)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center justify-center mt-6">
                                    <button className="p-3 hover:bg-blue-50 rounded-full transition-all duration-300 group">
                                        <FaExchangeAlt className="text-blue-600 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col w-full">
                                        <label className="block text-base font-semibold text-gray-700 mb-1">
                                            To
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                                                <FaPlane className="rotate-90" />
                                            </div>
                                            <select
                                                className="w-full rounded-lg pl-10 pr-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                                defaultValue="DXB"
                                            >
                                                <option value="DXB">Dubai (DXB)</option>
                                                <option value="JFK">New York (JFK)</option>
                                                <option value="LHR">London (LHR)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date Fields Container */}
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="flex-1">
                                    <div className="flex flex-col w-full">
                                        <label className="block text-base font-semibold text-gray-700 mb-1">
                                            Depart
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                                                <FaCalendarAlt />
                                            </div>
                                            <input
                                                type="date"
                                                className="w-full rounded-lg pl-10 pr-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {tripType === 'round' && (
                                    <div className="flex-1">
                                        <div className="flex flex-col w-full">
                                            <label className="block text-base font-semibold text-gray-700 mb-1">
                                                Return
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                                                    <FaCalendarAlt />
                                                </div>
                                                <input
                                                    type="date"
                                                    className="w-full rounded-lg pl-10 pr-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-auto md:self-end">
                            <button className="w-full md:w-[180px] h-[52px] bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-center items-center gap-2 font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105 active:scale-95">
                                <FaSearch className="text-sm" />
                                <span>Search Flights</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {['Best Deals', 'Popular Flights', 'Last Minute'].map((text) => (
                        <button
                            key={text}
                            className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
