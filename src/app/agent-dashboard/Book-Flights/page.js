"use client";
import { useState } from "react";
import { User, Plus, Minus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import Flights from "./Flights";

const FlightSearchBar = () => {
  const [tripType, setTripType] = useState("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0 });
  const [showTravelersDialog, setShowTravelersDialog] = useState(false);

  const locations = {
    from: ["Sialkot (SKT)", "Lahore (LHE)", "Karachi (KHI)", "Islamabad (ISB)", "Peshawar (PEW)"],
    to: ["Riyadh (RUH)", "Jeddah (JED)", "Dubai (DXB)", "Doha (DOH)", "Istanbul (IST)"],
  };

  const handleModify = () => {
    console.log({ tripType, from, to, departureDate, travelers });
  };

  const handleTravelerChange = (type, increment) => {
    setTravelers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

  const handleFromSelect = (location) => {
    setFrom(location);
    setShowFromDropdown(false);
  };

  const handleToSelect = (location) => {
    setTo(location);
    setShowToDropdown(false);
  };

  return (
    <div className="w-full flex flex-col">
     
    <div className="border-gray-200 border p-6 rounded-lg shadow-[0_0_5px_gray] mt-4 max-w-5xl mx-auto">
      {/* Trip Type */}
      <div className="flex space-x-6">
        {["one-way", "return", "multi-city"].map((type) => (
          <label key={type} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={type}
              checked={tripType === type}
              onChange={() => setTripType(type)}
              className="peer hidden"
            />
            <span className="peer-checked:text-white rounded-full px-3 py-1 border border-gray-500 peer-checked:bg-blue-600 font-medium capitalize">
              {type.replace("-", " ")}
            </span>
          </label>
        ))}
      </div>

      {/* Search Fields */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-4">
        {/* From */}
        <div className="relative">
          <label className="block text-gray-500 text-sm">From</label>
          <input
            type="text"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setShowFromDropdown(true);
            }}
            placeholder="Enter departure city"
            className="w-full border rounded-lg p-3 bg-white"
          />
          {showFromDropdown && from && (
            <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-auto">
              {locations.from
                .filter((loc) => loc.toLowerCase().includes(from.toLowerCase()))
                .map((loc) => (
                  <li
                    key={loc}
                    onClick={() => handleFromSelect(loc)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {loc}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* To */}
        <div className="relative">
          <label className="block text-gray-500 text-sm">To</label>
          <input
            type="text"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setShowToDropdown(true);
            }}
            placeholder="Enter destination city"
            className="w-full border rounded-lg p-3 bg-white"
          />
          {showToDropdown && to && (
            <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-auto">
              {locations.to
                .filter((loc) => loc.toLowerCase().includes(to.toLowerCase()))
                .map((loc) => (
                  <li
                    key={loc}
                    onClick={() => handleToSelect(loc)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {loc}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Departure */}
        <div className="relative">
          <label className="block text-gray-500 text-sm">Departure</label>
          <input
            type="text"
            value={departureDate ? departureDate.toDateString() : "Select a date"}
            readOnly
            onClick={() => setIsCalendarOpen(true)}
            className="w-full border rounded-lg p-3 bg-white cursor-pointer"
          />
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 bg-white border rounded-lg p-4">
              <Calendar
                selected={departureDate}
                onDayClick={(date) => {
                  setDepartureDate(date);
                  setIsCalendarOpen(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Travelers & Class */}
        <div className="relative">
          <label className="block text-gray-500 text-sm">Travelers & Class</label>
          <div
            className="w-full border rounded-lg p-3 bg-white flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowTravelersDialog(true)}
          >
            <User className="text-blue-600" />
            <span>{`Travelers ${travelers.adults + travelers.children + travelers.infants}`}</span>
          </div>
        </div>

        {/* Modify Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleModify}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Travelers Dialog */}
      <Dialog.Root open={showTravelersDialog} onOpenChange={setShowTravelersDialog}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
          <Dialog.Title className="text-lg font-medium mb-4">Select Travelers</Dialog.Title>
          {Object.entries(travelers).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center mb-4">
              <span className="capitalize">{type}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTravelerChange(type, -1)}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <Minus />
                </button>
                <span>{count}</span>
                <button
                  onClick={() => handleTravelerChange(type, 1)}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <Plus />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowTravelersDialog(false)}
            className="bg-blue-600 text-white w-full py-2 rounded-lg"
          >
            Done
          </button>
        </Dialog.Content>
      </Dialog.Root>
    </div>
    <div>
      <Flights/>
      </div>
    </div>
  );
};

export default FlightSearchBar;
