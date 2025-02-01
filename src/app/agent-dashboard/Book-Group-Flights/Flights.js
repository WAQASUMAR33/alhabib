import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function Flights(group) {
    const [flights, setFlights] = useState([]);
    const [loading, setloading] = useState(false)
    async function fetchFlights() {
        try {
            setloading(true);
            const response = await fetch(`/api/user/fetchgroupflights/${group.group}`);
            const result = await response.json();
            const data = result
            console.log("Full API response:", data);

            setFlights(data);
            setloading(false)
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    }

    useEffect(() => {
        fetchFlights();
    }, []);

    return (
        <div className="p-4 max-h-[80vh] overflow-auto scroll-smooth scrol">
            <h1 className="text-2xl font-bold mb-4">Available Flights</h1>
            {loading? <Loader className="animate-spin"/>:flights.length === 0 && (
                <p className="text-gray-500">No flights available at the moment.</p>
            )}
            
            <div className="space-y-4">
                {flights.map((flight, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-4 bg-white"
                    >
                        <div className="flex justify-between items-center bg-blue-500 text-white p-2 rounded-t-lg">
                            <div className="flex gap-4"><p className="">Airline: {flight.FlightAirline?.name}</p> <p>SN: {flight.FlightAirline?.sn}</p><p>Type: {flight.FlightSector?.type}</p> </div>
                            <p>Price: {flight.fare} PKR</p>
                        </div>
                        <table className="w-full text-left mt-2">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Flight#</th>
                                    <th className="p-2">Origin-Destination</th>
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Baggage</th>
                                    <th className="p-2">Meal</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr
                                    key='1'
                                    className={`${1 % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        }`}
                                >
                                    <td className="p-2">
                                        {new Date(flight.dept_time2).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </td>
                                    <td className="p-2">{flight.flight_number2}</td>
                                    <td className="p-2">
                                        {flight.origin2} - {flight.destination2}
                                    </td>
                                    <td className="p-2">
                                        {new Date(flight.dept_time2).toLocaleTimeString(
                                            "en-GB",
                                            { hour: "2-digit", minute: "2-digit" }
                                        )}{" "}
                                        -{" "}
                                        {new Date(flight.arrival_time2).toLocaleTimeString(
                                            "en-GB",
                                            { hour: "2-digit", minute: "2-digit" }
                                        )}
                                    </td>
                                    <td className="p-2">{flight.baggage}</td>
                                    <td className="p-2">{flight.meal ? "Yes" : "No"}</td>
                                </tr>
                                {flight.FlightSector?.type === "two-way" && (
                                    <tr
                                        key='2'
                                        className={`${2 % 2 === 0 ? "bg-gray-100" : "bg-white"
                                            }`}
                                    >
                                        <td className="p-2">
                                            {new Date(flight.dept_time).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </td>
                                        <td className="p-2">{flight.flight_number}</td>
                                        <td className="p-2">
                                            {flight.origin} - {flight.destination}
                                        </td>
                                        <td className="p-2">
                                            {new Date(flight.dept_time).toLocaleTimeString(
                                                "en-GB",
                                                { hour: "2-digit", minute: "2-digit" }
                                            )}{" "}
                                            -{" "}
                                            {new Date(flight.arrival_time).toLocaleTimeString(
                                                "en-GB",
                                                { hour: "2-digit", minute: "2-digit" }
                                            )}
                                        </td>
                                        <td className="p-2">{flight.baggage}</td>
                                        <td className="p-2">{flight.meal ? "Yes" : "No"}</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                        <div className="flex justify-end mt-2">
                            <a href={`/agent-dashboard/Book-Group-Flights/BookingForm/${flight.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Book Now
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
