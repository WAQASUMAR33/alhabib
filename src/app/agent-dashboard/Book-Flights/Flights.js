import { useEffect, useState } from "react";

export default function Flights() {
    const [flights, setFlights] = useState([]);

    async function fetchFlights() {
        try {
            const response = await fetch("/api/admin/fetchflights");
            const result = await response.json();
            const data = result.data
            console.log("Full API response:", data);

            if (data && Array.isArray(data)) {
                // Grouping flights as two-way (assuming they are paired as departure and return flights)
                const groupedFlights = data.map((flightDetails) => ({
                    airline: flightDetails.airline,
                    fare: flightDetails.fare,
                    meal: flightDetails.meal,
                    type: flightDetails.type,
                    flights: flightDetails.SingleFlight.map((singleFlight) => ({
                        flightNumber: singleFlight.flight_number,
                        origin: singleFlight.origin,
                        destination: singleFlight.destination,
                        departureTime: singleFlight.dept_time,
                        arrivalTime: singleFlight.arrival_time,
                        baggage: singleFlight.baggage,
                    })),
                }));
                setFlights(data);
            } else {
                console.error("Invalid data structure:", data);
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    }

    useEffect(() => {
        fetchFlights();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Available Flights</h1>
            {flights.length === 0 && (
                <p className="text-gray-500">No flights available at the moment.</p>
            )}
            <div className="space-y-4">
                {flights.map((flightGroup, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white"
                    >
                        <div className="flex justify-between items-center bg-blue-500 text-white p-2 rounded-t-lg">
                            <div className="flex space-x-4"><p className="font-semibold">Airline: {flightGroup.airline}</p> <p className="font-semibold">Airline: {flightGroup.airline_sn}</p></div>
                            <p>Price: {flightGroup.fare} PKR</p>
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
                                {flightGroup.SingleFlight?.map((flight, flightIndex) => (
                                    <tr
                                        key={flightIndex}
                                        className={`${
                                            flightIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
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
                                        <td className="p-2">{flightGroup.meal ? "Yes" : "No"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-2">
                            <a href={`/agent-dashboard/Book-Flights/BookingForm/${flightGroup.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Book Now
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
