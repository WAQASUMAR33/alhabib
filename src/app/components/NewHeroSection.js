'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plane, Building2, Briefcase, ArrowLeftRight, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from 'next/image'

const backgroundImages = [
  "/bg/bg (1).jpeg",
  "/bg/bg (2).jpeg",
  "/bg/bg (3).jpeg",
  "/bg/bg (4).jpeg",
  "/bg/bg (5).jpeg",
]

export default function NewHeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('flights')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative  flex flex-col md:h-screen justify-center items-center overflow-hidden ">
      {/* Background Images Slider */}
      <div className="absolute inset-0 transition-opacity duration-1000 h-screen">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              width={1000}
              height={1000}
              src={image}
              alt={`Travel destination ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            height="160"
          >
            <path
              fill="white"
              d="M0,128L60,138.7C120,149,240,171,360,160C480,149,600,107,720,96C840,85,960,107,1080,122.7C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div> */}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto md:max-w-7xl px-4 mt-20 md:mt-0 md:pt-20  md:px-8 ">
        <h1 className="text-center text-xl md:text-4xl capitalize p-4 md:p-6 border-4 border-white bg-black/10 backdrop-blur-sm font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover the real value of travel
        </h1>

        {/* Search Form */}
        <div className="relative mx-auto  mt-10 m-4 w-full md:max-w-4xl rounded-xl shadow-lg">
          {/* Tabs */}
          <div className=" flex space-x-2 text-xs md:text-base">
            <button
              className={`flex items-center border-x border-t transition-all duration-500 border-black space-x-2 px-1 py-1 md:px-4 md:py-2 rounded-t-lg ${activeTab === 'flights'
                ? 'text-black bg-white'
                : 'text-white  backdrop-blur-sm bg-black/50 hover:bg-white/50  hover:text-black'
                }`}
              onClick={() => setActiveTab('flights')}
            >
              <Plane className="h-5 w-5" />
              <span>Flights</span>
            </button>
            <button
              className={`flex items-center border-x border-t transition-all duration-500 border-black space-x-2 px-4 py-2 rounded-t-lg ${activeTab === 'hotels'
                ? ' text-black bg-white'
                : 'text-white  backdrop-blur-sm bg-black/50 hover:bg-white/50  hover:text-black'
                }`}
              onClick={() => setActiveTab('hotels')}
            >
              <Building2 className="h-5 w-5" />
              <span>Hotels</span>
            </button>
            <a href='/'>
              <button
                className={`flex items-center relative border-x border-t transition-all duration-500 border-white space-x-2 px-4 py-2 rounded-t-lg ${activeTab === 'business'
                  ? ' text-black bg-white'
                  : 'text-white  backdrop-blur-sm bg-black/50 hover:bg-white/50  hover:text-black'
                  }`}
              // onClick={() => setActiveTab('business')}
              >
                <Briefcase className="h-5 w-5" />
                <span>Group Tickets</span>
                <span className="ml-1 absolute -right-2 -top-2  rounded bg-orange-500 px-1.5 py-0.5 text-xs text-white">NEW</span>
              </button>
            </a>
          </div>
          <div className='border-x border-b border-black rounded-b-lg bg-white text-xs md:text-base'>

            {activeTab === 'flights' && (
              <div className='bg-white pt-4 px-4'>
                {/* Trip Type Selection */}
                <div className="mb-4 flex space-x-4 ">
                  <button className="rounded-full border bg-white px-4 py-1">One-way</button>
                  <button className="rounded-full border bg-primary px-4 py-1 text-white">Round-trip</button>
                  <button className="rounded-full border bg-white px-4 py-1">Multi-city</button>
                </div>

                {/* Flight Search Fields */}
                <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm text-gray-600">From</label>
                    <Input placeholder="Enter city or airport" className='text-xs md:text-base' />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-xs md:text-sm text-gray-600">To</label>
                    <div className="">
                      <Input placeholder="Enter city or airport" className='text-xs md:text-base' />
                      <button className="hidden md:flex absolute  right-[98%] text-2xl border border-black top-[70%] -translate-y-1/2 rounded-full bg-white p-1">
                        <ArrowLeftRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm text-gray-600">Depart</label>
                    <Input type="date" className='text-xs md:text-base' />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm text-gray-600">Return</label>
                    <Input type="date" className='text-xs md:text-base' />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="mt-4 flex flex-nowrap items-center gap-4">
                  <Select defaultValue="1" >
                    <SelectTrigger className="w-[48%]">
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Adult</SelectItem>
                      <SelectItem value="2">2 Adults</SelectItem>
                      <SelectItem value="3">3 Adults</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="economy">
                    <SelectTrigger className="w-[48%]">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <input type="checkbox" id="direct-flight" className="rounded border-gray-300" />
                  <label htmlFor="direct-flight" className="text-sm text-gray-600">
                    Direct flight only
                  </label>
                </div>

              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="bg-white p-4 space-y-2">
                <h2 className="text-xl font-semibold">Where do you want to stay?</h2>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Destination</label>
                    <Input
                      placeholder="Enter a destination"
                      defaultValue="Dera Ghazi Khan, Pakistan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Check In</label>
                    <Input
                      type="date"
                      defaultValue="2024-12-13"

                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Check Out</label>
                    <Input
                      type="date"
                      defaultValue="2024-12-14"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Guests & Rooms</label>
                    <Select defaultValue="2-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-1">1 Adult in 1 Room</SelectItem>
                        <SelectItem value="2-1">2 Adults in 1 Room</SelectItem>
                        <SelectItem value="2-2">2 Adults in 2 Rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="free-cancellation" className="rounded border-gray-300" />
                  <label htmlFor="free-cancellation" className="text-sm text-gray-600">
                    Free cancellation
                  </label>
                </div>
              </div>
            )}

            <div className="mt-0 flex justify-end p-4">
              <Button className="bg-[#5AB54B] hover:bg-[#4a9e3c]">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Image Slider Dots */}
        {/* <div className="absolute bottom-32 left-1/2 flex -translate-x-1/2 space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div> */}
      </div>
    </div>
  )
}

